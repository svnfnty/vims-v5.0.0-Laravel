import{g as n}from"./index-CB87Sc6I.js";import{S as d}from"./sweetalert2.esm.all-BoFtKDfH.js";const e=window.jQuery;e.ajaxSetup({headers:{"X-CSRF-TOKEN":e('meta[name="csrf-token"]').attr("content")}});e(document).ready(function(){let c=[],r=[],f="cards",p="create";e(".js-example-basic-single").select2({width:"100%",placeholder:"Select a policy series to view details...",allowClear:!0}),b(),w(),setTimeout(function(){e('.toggle-btn[data-view="cards"]').trigger("click")},100),e("#loadDataBtn").on("click",function(){w()}),e("#create_new").on("click",function(){openCreateModal()}),e(".toggle-btn").on("click",function(){f=e(this).data("view"),e(".toggle-btn").removeClass("active"),e(this).addClass("active"),e("#cardView").hide(),e("#tableView").hide(),e("#series-table-container").hide(),e("#cardView").removeClass("active cards-view grid-view list-view"),f==="cards"?(e("#cardView").addClass("cards-view active").show(),h(r)):f==="grid"?(e("#cardView").addClass("grid-view active").show(),h(r)):f==="table"&&(e("#tableView").addClass("active").show(),g(r))}),e("#statusFilter").on("change",function(){let t=e(this).val();x(t)}),e("#resetFilters").on("click",function(){e("#statusFilter").val("all"),x("all")}),e("#seriesForm").on("submit",function(t){t.preventDefault(),T()});function b(){e.ajax({url:window.seriesRoutes.stats,type:"GET",dataType:"json",success:function(t){e("#totalSeries").text(t.total),e("#activeSeries").text(t.active),e("#inactiveSeries").text(t.inactive)}})}function w(){e.ajax({url:window.seriesRoutes.data,type:"GET",dataType:"json",success:function(t){c=t.data||[],r=c,h(r),g(r)},error:function(){console.log("Error loading series")}})}function x(t){t==="all"?r=c:t==="active"?r=c.filter(a=>a.status==1):t==="inactive"&&(r=c.filter(a=>a.status==0)),r.length===0&&t!=="all"?(e("#cardView").addClass("hidden"),e("#tableView").addClass("hidden"),e("#filteredEmptyState").removeClass("hidden")):(e("#cardView").removeClass("hidden"),e("#tableView").removeClass("hidden"),e("#filteredEmptyState").addClass("hidden"),f==="cards"||f==="grid"||f==="list"?h(r):g(r))}function h(t){if(t.length===0){e("#cardView").html(`
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-list-ol"></i>
                    </div>
                    <h3>No Series Found</h3>
                    <p>Get started by adding your first series to the system</p>
                </div>
            `);return}let a="";t.forEach(function(s,i){const o=s.status==1?"active":"inactive",l=s.status==1?"Active":"Inactive",u=s.type==0?"Pacific":s.type==1?"Liberty":"Stronghold",m=new Date(s.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),y=window.userId===1&&window.userOfficeId===0,v=s.office?s.office.office_name:"N/A",S=y?`
                <div class="detail-row">
                    <span class="detail-label">Office:</span>
                    <span class="detail-value">${v}</span>
                </div>
            `:"";a+=`
                <div class="series-card" data-status="${o}" data-office="${v}" data-id="${s.id}">
                    <div class="card-header">
                        <div class="series-meta">
                            <span class="series-id">Series #${s.id}</span>
                            <span class="series-date">${m}</span>
                        </div>
                        <div class="status-badge ${o}">
                            ${l}
                        </div>
                    </div>

                    <div class="card-body">
                        <h3 class="series-name">${s.name}</h3>
                        <div class="series-details">
                            <div class="detail-row">
                                <span class="detail-label">Range:</span>
                                <span class="detail-value">${s.range_start} - ${s.range_stop}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${u}</span>
                            </div>
                            ${S}
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="action-btn-small view view_data" data-id="${s.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions>0?`<button class="action-btn-small edit edit_data" data-id="${s.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>`:""}
                            ${window.userPermissions===1?`<button class="action-btn-small delete delete_data" data-id="${s.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </div>
            `}),e("#cardView").html(a),$()}function g(t){const a=window.userId===1&&window.userOfficeId===0;if(t.length===0){const i=a?9:8;e("#tableBody").html(`
                <tr>
                    <td colspan="${i}">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-list-ol"></i>
                            </div>
                            <h3>No Series Found</h3>
                            <p>Get started by adding your first series to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New Series
                            </button>
                        </div>
                    </td>
                </tr>
            `),e("#create_new_empty_table").on("click",function(){openCreateModal()});return}let s="";t.forEach(function(i,o){const l=i.status==1?"active":"inactive",u=i.status==1?"Active":"Inactive",m=i.type==0?"Pacific":i.type==1?"Liberty":"Stronghold",y=new Date(i.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),v=i.office?i.office.office_name:"N/A",S=a?`<td>${v}</td>`:"";s+=`
                <tr data-status="${l}" data-office="${v}" data-id="${i.id}">
                    <td class="text-center">${o+1}</td>
                    <td><strong>${i.name}</strong></td>
                    <td>${i.range_start}</td>
                    <td>${i.range_stop}</td>
                    <td>${m}</td>
                    <td class="text-center">
                        <span class="status-badge ${l}">${u}</span>
                    </td>
                    <td>${y}</td>
                    ${S}
                    <td>
                        <div class="action-dropdown">
                            <button class="action-btn">
                                <i class="fas fa-ellipsis-v"></i>
                                Actions
                            </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item view_data" data-id="${i.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </a>
                            ${window.userPermissions>0?`<div class="dropdown-divider"></div>
                            <button class="dropdown-item edit_data" data-id="${i.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>`:""}
                            ${window.userPermissions===1?`<div class="dropdown-divider"></div>
                            <button class="dropdown-item delete_data" data-id="${i.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>`:""}
                        </div>
                        </div>
                    </td>
                </tr>
            `}),e("#tableBody").html(s),C()}function $(){e(".view_data").on("click",function(){const t=e(this).data("id");openViewModal(t)}),e(".edit_data").on("click",function(){const t=e(this).data("id");openEditModal(t)}),e(".delete_data").on("click",function(){const t=e(this).data("id");d.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(a=>{a.isConfirmed&&_(t)})})}function C(){e(".action-btn").on("click",function(t){t.stopPropagation(),e(this).next(".dropdown-menu").toggleClass("show")}),e(document).on("click",function(t){e(t.target).closest(".action-dropdown").length||e(".action-dropdown .dropdown-menu").removeClass("show")}),e(".view_data").on("click",function(){const t=e(this).data("id");openViewModal(t)}),e(".edit_data").on("click",function(){const t=e(this).data("id");openEditModal(t)}),e(".delete_data").on("click",function(){const t=e(this).data("id");d.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(a=>{a.isConfirmed&&_(t)})})}window.openCreateModal=function(){p="create",e("#modalTitle").text("Create New Series"),e("#submitBtn").html('<i class="fas fa-save"></i> Save Series'),e("#formMethod").val("POST"),e("#seriesForm").attr("action",window.seriesRoutes.store),e("#seriesForm")[0].reset(),e(".error-message").text(""),e(".form-control").removeClass("error"),e("#viewOnlyGroup").hide(),e("#seriesForm").show(),window.userId===1&&window.userOfficeId===0&&e("#officeSelectGroup").show(),e("#seriesModal, #modalOverlay").show(),n.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),n.fromTo("#seriesModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),n.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openEditModal=function(t){p="edit";const a=c.find(s=>s.id==t);a&&(e("#modalTitle").text("Edit Series"),e("#submitBtn").html('<i class="fas fa-save"></i> Update Series'),e("#formMethod").val("PUT"),e("#seriesForm").attr("action","/series/"+t),e("#name").val(a.name),e("#range_start").val(a.range_start),e("#range_stop").val(a.range_stop),e("#type").val(a.type),e("#status").val(a.status),e(".error-message").text(""),e(".form-control").removeClass("error"),e("#viewOnlyGroup").hide(),e("#seriesForm").show(),e("#officeSelectGroup").hide(),e("#seriesModal, #modalOverlay").show(),n.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),n.fromTo("#seriesModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),n.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))},window.openViewModal=function(t){p="view";const a=c.find(s=>s.id==t);a&&(e("#modalTitle").text("View Series Details"),e("#submitBtn").html('<i class="fas fa-edit"></i> Edit').attr("type","button"),e("#submitBtn").off().on("click",function(){n.to("#seriesModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){openEditModal(t)}})}),e("#name").val(a.name).attr("readonly",!0),e("#range_start").val(a.range_start).attr("readonly",!0),e("#range_stop").val(a.range_stop).attr("readonly",!0),e("#type").val(a.type).attr("disabled",!0),e("#status").val(a.status).attr("disabled",!0),e("#createdDateDisplay").text(new Date(a.created_at).toLocaleString()),e(".error-message").text(""),e(".form-control").removeClass("error"),e("#viewOnlyGroup").show(),e("#seriesForm").show(),e("#seriesModal, #modalOverlay").show(),n.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),n.fromTo("#seriesModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),n.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))},window.closeSeriesModal=function(){n.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){e("#modalOverlay").hide()}}),n.to("#seriesModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e("#seriesModal").hide(),e("#seriesForm")[0].reset(),e(".form-control").removeAttr("readonly").removeAttr("disabled"),e(".error-message").text("")}})};function T(){if(p==="view")return;const t=e("#seriesForm").attr("action"),a=e("#formMethod").val(),s={name:e("#name").val(),range_start:e("#range_start").val(),range_stop:e("#range_stop").val(),type:e("#type").val(),status:e("#status").val(),_token:e('meta[name="csrf-token"]').attr("content")};if(window.userId===1&&window.userOfficeId===0&&p==="create"){const o=e("#office_id").val();o&&(s.office_id=o)}a==="PUT"&&(s._method="PUT"),console.log("Form Data:",s),console.log("URL:",t),console.log("Method:",a),e.ajax({url:t,type:"POST",data:s,dataType:"json",headers:{"X-CSRF-TOKEN":e('meta[name="csrf-token"]').attr("content")},success:function(o){console.log("Success:",o),b(),w(),closeSeriesModal(),d.fire({title:"Success!",text:o.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})},error:function(o){if(console.error("Error:",o),console.error("Status:",o.status),console.error("Response:",o.responseText),o.status===422){const l=o.responseJSON.errors;e.each(l,function(u,m){e("#"+u+"-error").text(m[0]),e("#"+u).addClass("error")}),d.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else o.status===419?(d.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):o.status===404?d.fire({title:"Error!",text:"Route not found. Please check your routes configuration.",icon:"error"}):o.responseJSON&&o.responseJSON.error?d.fire({title:"Error!",text:o.responseJSON.error,icon:"error"}):d.fire({title:"Error!",text:o.status+" - "+o.statusText,icon:"error"})}})}function _(t){e.ajax({url:"/series/"+t,type:"DELETE",headers:{"X-CSRF-TOKEN":e('meta[name="csrf-token"]').attr("content")},success:function(){b(),w(),d.fire({title:"Deleted!",text:"Series has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})},error:function(a){console.error("Error:",a),a.status===419?(alert("Error: Session expired. Please refresh the page and try again."),location.reload()):alert("Error deleting series")}})}window.showSeries=function(t){if(!t){d.fire({title:"Warning!",text:"Please select a series first.",icon:"warning"});return}e("#cardView").hide(),e("#tableView").hide(),e("#filteredEmptyState").hide(),e("#series-table-placeholder").show(),e("#series-table-container").hide(),fetch(`/series/api/getseries?id=${t}`).then(a=>{if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);return a.json()}).then(a=>{let s=`
                    <style>
                        .series-container {
                            max-width: 100%;
                            overflow-x: auto;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                        }

                        .series-table {
                            width: 100%;
                            border-collapse: separate;
                            border-spacing: 0;
                            font-size: 14px;
                            margin-top: 15px;
                        }

                        .series-table th {
                            background-color: #f1f5f9;
                            color: #334155;
                            font-weight: 600;
                            padding: 12px 16px;
                            border-bottom: 2px solid #e2e8f0;
                            position: sticky;
                            top: 0;
                            text-align: left;
                        }

                        .series-table td {
                            padding: 12px 16px;
                            border-bottom: 1px solid #e2e8f0;
                            vertical-align: middle;
                            transition: background-color 0.2s;
                        }

                        .series-table tr:hover td {
                            background-color: #f8fafc;
                        }

                        .badge {
                            border-radius: 6px;
                            padding: 6px 10px;
                            font-weight: 600;
                            display: inline-block;
                            min-width: 80px;
                            text-align: center;
                            font-size: 13px;
                            letter-spacing: 0.5px;
                        }

                        .badge-issued {
                            background-color: #dcfce7;
                            color: #166534;
                            border: 1px solid #bbf7d0;
                        }

                        .badge-unissued {
                            background-color: #e2e8f0;
                            color: #475569;
                            border: 1px solid #cbd5e1;
                        }
                    </style>
                    <div class="series-container">
                        <table class="series-table">
                            <thead>
                                <tr>
                                    <th>COC No</th>
                                    <th>Name</th>
                                    <th>Plate No</th>
                                    <th>Cost</th>
                                    <th>Policy Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>`;a&&a.length>0?a.forEach(o=>{const l=o.policy_status==="Unallocated"?"badge-unissued":"badge-issued";s+=`
                            <tr>
                                <td>${o.coc_no||"N/A"}</td>
                                <td>${o.name||"N/A"}</td>
                                <td>${o.plate_no||"N/A"}</td>
                                <td>${o.cost||"N/A"}</td>
                                <td><span class="badge ${l}">${o.policy_status||"N/A"}</span></td>
                                <td>${o.date||"N/A"}</td>
                            </tr>`}):s+=`
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px;">
                                <div class="empty-state">
                                    <div class="empty-icon">
                                        <i class="fas fa-list-ol"></i>
                                    </div>
                                    <h3>No Series Data Found</h3>
                                    <p>No data available for this series.</p>
                                </div>
                            </td>
                        </tr>`,s+=`
                            </tbody>
                        </table>
                    </div>`,e("#series-table-content").html(s),e("#series-table-placeholder").hide(),e("#series-table-container").show();const i=new Date;e("#last-updated").text("Last updated: "+i.toLocaleTimeString())}).catch(a=>{console.error("Error fetching series data:",a),e("#series-table-content").html(`
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Failed to fetch series data. Please try again later.
                    </div>
                `),e("#series-table-placeholder").hide(),e("#series-table-container").show()})}});
