<h3>{ts}Contribution Pages{/ts}</h3>
<select id="PageSelector">
    {foreach from=$pages item=p}
        <option value="{$p.id}">{$p.title}</option>
    {/foreach}
</select>
<p>{ts}If you leave the breadcrumb for a page blank it will not be shown in the list (Use with jQuery Selectors to show billing block as final step){/ts}.</p>
<button id="AddPage" class="AddStepButton" data-step-type="page">{ts}Add Page to Workflow{/ts}</button>