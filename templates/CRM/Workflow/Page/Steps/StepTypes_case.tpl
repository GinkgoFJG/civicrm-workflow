<div id="SimpleWorkflowTypeTemplateCase">
    <input type ="hidden" name="data[#ORDER#][entity_id]" class="entity_id" />

    <div class="SWStepField">
        <label>{ts}Include Profile{/ts}:</label>
        <input data-entities='{$profilesDataEntities}' name="data[#ORDER#][options][include_profile]" type="text" class="case_option_include_profile">
    </div>

    <div class="SWStepField">
        <label>{ts}Mode{/ts}:</label>
        <select name="data[#ORDER#][options][mode]" class="case_option_mode">
            <option value="create">{ts}Create{/ts}</option>
            <option value="edit">{ts}Edit{/ts}</option>
        </select>
    </div>

    <div class="SWStepField">
        <label>{ts}Fields to Include{/ts}:</label>
        <input name="data[#ORDER#][options][core_fields]" class="case_option_core_fields" />
    </div>

    <!--// Add relationships that will be auto-created for this case //-->
    <fieldset class="SW-Case-Relationships-Wrapper">
        <legend>{ts}Roles{/ts}</legend>
        <p>{ts key='profile-relationship-help'}Roles that will be assigned for this case (these should match existing roles in the case type):{/ts}</p>
        {include file=$relationshipWidget location="bottom"}
    </fieldset>

    <fieldset>
        <legend>{ts}Defaults:{/ts}</legend>

        <div class="SWStepField">
            <label>{ts}Client{/ts}:</label>
            <input type="hidden" class="SW-Relationship-Contact-Hidden case_option_defaults_client_id" name="data[#ORDER#][options][defaults][client_id]" />
            <select class="SW-Relationship-Contact case_option_defaults_client_id_widget">
                <option value="<user>">Active User</option>
            </select>
        </div>

        <div class="SWStepField">
            <label>{ts}Activity Medium{/ts}:</label>
            <select name="data[#ORDER#][options][defaults][medium_id]" class="case_option_defaults_medium_id">
                {foreach from=$caseMediums item=mediumName key=mediumValue}
                    <option value="{$mediumValue}">{$mediumName}</option>
                {/foreach}
            </select>
        </div>

        <div class="SWStepField">
            <label>{ts}Location{/ts}:</label>
            <input name="data[#ORDER#][options][defaults][activity_location]" class="case_option_defaults_activity_location" />
        </div>

        <div class="SWStepField">
            <label>{ts}Subject{/ts}:</label>
            <input name="data[#ORDER#][options][defaults][activity_subject]" class="case_option_defaults_activity_subject" />
        </div>


        <div class="SWStepField">
            <label>{ts}Case Status{/ts}:</label>
            <select name="data[#ORDER#][options][defaults][status_id]" class="case_option_defaults_status_id">
                {foreach from=$caseStatus item=statusName key=statusValue}
                    <option value="{$statusValue}">{$statusName}</option>
                {/foreach}
            </select>
        </div>

        <div class="SWStepField">
            <label>{ts}Duration{/ts}:</label>
            <input name="data[#ORDER#][options][defaults][duration]" class="case_option_defaults_duration" />
        </div>


    </fieldset>

</div>