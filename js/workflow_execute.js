CRM.$(function ($) {
  //Utility function when we don't know if steps will be zero indexed.
  function first(p){for(var i in p)return p[i];}

  CRM.Workflow.get_next_step = function() {
    return $("ol.WorkflowSteps .stepTodo:first").data("order");
  };

  CRM.Workflow.load_step = function(order) {
    $('ol.WorkflowSteps li[data-order='+currentStep.order+']').removeClass("stepActive");
    if ($('ol.WorkflowSteps li[data-order='+currentStep.order+']').hasClass("completed")) {
      $('ol.WorkflowSteps li[data-order='+currentStep.order+']').addClass("stepDone");
    } else {
      $('ol.WorkflowSteps li[data-order='+currentStep.order+']').addClass("stepTodo");
      $('ol.WorkflowSteps li[data-order='+currentStep.order+']').addClass("stepAvailable");
    }

    //Set the currentStep
    currentStep = CRM.Workflow.steps[order];
    //Trigger an Step Load event
    $("body").trigger("SimpleWorkflow:Step:Load", currentStep);


    if (currentStep.title && currentStep.title.length) {
      $("#WorkflowTitle legend").text(currentStep.title);
      $("#WorkflowTitle").show();
    } else {
      $("#WorkflowTitle").hide();
    }

    $("#PreMessage").html(currentStep.pre_message);
    $("#PostMessage").html(currentStep.post_message);

    //Set the new form step to active
    $('ol.WorkflowSteps li[data-order='+order+']').removeClass("stepDone");
    $('ol.WorkflowSteps li[data-order='+order+']').removeClass("stepTodo");
    $('ol.WorkflowSteps li[data-order='+order+']').removeClass("stepAvailable");
    $('ol.WorkflowSteps li[data-order='+order+']').addClass("stepActive");

    //Set the window Hash so it can be recalled on backbutton press
    location.hash = order;
    CRM.Workflow.stepIndex = order;
  };

  CRM.Workflow.skipToStep = function(index) {

    //Trigger the teardown event
    $("body").trigger("SimpleWorkflow:Step:Teardown", CRM.Workflow.steps[CRM.Workflow.stepIndex]);

    //If we are injecting into a page, but moving to the page content
    if (CRM.Workflow.method == "inject" && CRM.Workflow.steps[index].entity_table == "Page") {
      //Destroy the snippet so we don't get any overlapping behavior
      $("#ActionWindow").crmSnippet("destroy");
    }

    //Hide the SW Button
    $("#SWNextButton").hide();

    CRM.Workflow.load_step(index);
  };

  CRM.Workflow.inject_workflow_elements = function() {
    $("#Main").before('<div id="ActionWindow"></div>');
    $("#ActionWindow").before('<ol class="WorkflowSteps" id="WorkflowSteps"></ol>');
    $("#ActionWindow").before('<div id="PreMessage"></div>');
    $("#crm-submit-buttons").before('<div id="PostMessage"></div>');


    if (CRM.Workflow.returning) {
      var liclass = "stepDone";
      $("#ActionWindow").hide();
    } else {
      var liclass = "stepTodo";
      $(".crm-contribution-main-form-block").hide();
    }
    for (var i in CRM.Workflow.steps){
      if (CRM.Workflow.steps[i]['breadcrumb']) {
        $("#WorkflowSteps").append('<li class="'+liclass+' '+ CRM.Workflow.steps[i]['entity_table'] + '" data-order="' + CRM.Workflow.steps[i]['order'] + '"><span>' + CRM.Workflow.steps[i]['breadcrumb'] + '</span></li>');
      }
    }
    //Move the Intro Text
    $("#WorkflowSteps").before( $("#intro_text") );

    //Add a title Object
    $("#WorkflowSteps").after("<fieldset id='WorkflowTitle'><legend></legend></fieldset>");
    $("#WorkflowTitle").hide();

    //add a jquery next button if we are on a contirubtion page
    $(".crm-contribution-main-form-block").append("<a href='#' id='SWNextButton' class='button'><span> Next </span></a><div class='clear'></div>");

    //add wrapper to billing payment block so that it can be controlled.
    $("#billing-payment-block").wrap('<div class="WorkflowBillingBlock" id="WorkflowBillingBlock"></div>');

    //add wrapper to submit button so that it can be controlled.
    $("#crm-submit-buttons").wrap('<div class="WorkflowSubmit" id="WorkflowSubmit"></div>');

  };

  CRM.Workflow.CompleteCurrentStep = function() {
    //Add Classes to the progress-bar
    $('ol.WorkflowSteps li[data-order='+currentStep.order+']').removeClass("stepActive");
    $('ol.WorkflowSteps li[data-order='+currentStep.order+']').addClass("stepDone");
    $('ol.WorkflowSteps li[data-order='+currentStep.order+']').addClass("completed");

    //Trigger the teardown event
    $("body").trigger("SimpleWorkflow:Step:Teardown", CRM.Workflow.steps[CRM.Workflow.stepIndex]);

    //Hide the SW Button
    $("#SWNextButton").hide();

    //Load the next step in the workflow
    CRM.Workflow.load_step(CRM.Workflow.get_next_step());
  };

  CRM.Workflow.lastStep = function() {
    var last = Object.keys(CRM.Workflow.steps).slice(-1)[0];
    return CRM.Workflow.steps[last];
  };

  CRM.Workflow.onLastStep = function() {
    var last = CRM.Workflow.lastStep();
    return (currentStep.order === last.order);
  };

  CRM.Workflow.SetButtonText = function() {
    if (CRM.Workflow.onLastStep()) {
      $("#SWNextButton").hide()
    } else {
      $("#SWNextButton span").text(" " + currentStep.next + " ");
      $("#SWNextButton").show()
    }
  };



  /***********[ Run The Page ]*****************/
  //Check the method we are using and inject elements when needed
  if (CRM.Workflow.method == "inject") {
    inject_workflow_elements();
  }

  //Set the breadcrumb width
  $("ol.WorkflowSteps li").css("width", CRM.Workflow.breadcrumWidth + "%");

  //Allow each step in the breadcrumb to be clickable
  $("ol.WorkflowSteps li").click(function(e) {
    var obj = $(e.target).parent();
    //todo: This whole function should be abstracted out
    if(obj.hasClass("stepDone") || obj.hasClass("stepAvailable")) {
      CRM.Workflow.skipToStep(obj.data("order"));
    }
  });

  //Enable the custom Next button to move the flow along
  $("#SWNextButton").click(function(e) {
    CRM.Workflow.CompleteCurrentStep();
    return e.preventDefault();
  });
  $("#SWNextButton").hide();

  var currentStep = first(CRM.Workflow.steps);

  //Initiate the object that will load the pages
  //This must be below where we inject the ActionWindow
  var swin = $("#ActionWindow").crmSnippet();

  //Bind to the load event to make small changes to the various Forms
  swin.on("crmLoad", function(event) {
    if($(event.target).attr("id") == "ActionWindow") {
      $("#ActionWindow .crm-form-submit").val(" " + currentStep.next + " ");
      $("#ActionWindow a.cancel").hide();

      //Todo: This is deprecated and should be replaced with CustomJS from step.
      var stepfname = window['SimpleWorkflow_Step_' + currentStep.name + "_Load"];
      if (typeof stepfname == 'function') {
        stepfname();
      }

      //Add a hidden field to trigger the backend that this is a
      //workflow "form"
      $("#ActionWindow form").append("<input type='hidden' name='SimpleWorkflowFormStep' value='" + CRM.Workflow.workflow.id + "_" + currentStep.name + "' />");
    }
  });

  swin.on("crmBeforeLoad", function(e, data) {

  });

  //When each form is submitted.
  swin.on("crmFormSuccess", function(e, data) {
    //This keeps the page from "refreshing" and loading the workflow a second time into the div
    $("#ActionWindow").crmSnippet("destroy");
    CRM.Workflow.CompleteCurrentStep();
  });

  //Setup history functions So clicking back, takes you to previous tab
  window.onhashchange = function() {
    if (location.hash.length > 0) {
      var hashOrder = parseInt(location.hash.replace('#',''),10);
      CRM.Workflow.skipToStep(hashOrder);
    }
  };

  //Load the first step when the page loads
  //Or the last step if we are returning.
  if (CRM.Workflow.returning) {

    //Mark all the steps as visited so it doesn't look like we are on the last step
    //with an incomplete workflow
    $('ol.WorkflowSteps li').addClass("completed");
    $('ol.WorkflowSteps li:last').removeClass("completed");


    //Loop through the tabs, and check to see if there are errors, and if so
    //add an error class to them.
    $.each(CRM.Workflow.steps, function(tab, data) {
      if ($(data.entity_id).find(".error").length) {
        $('ol.WorkflowSteps li[data-order='+tab+']').addClass("stepHasErrors");
      }
    });

    CRM.Workflow.load_step(CRM.Workflow.lastStep());
  }  else {
    CRM.Workflow.load_step(currentStep.order);
  }

});

