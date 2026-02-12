import{g as c}from"./index-CB87Sc6I.js";import{S as u}from"./sweetalert2.esm.all-BoFtKDfH.js";var h;const y=((h=document.querySelector('meta[name="csrf-token"]'))==null?void 0:h.getAttribute("content"))||"";let f=[],d=[],l="cards",w="create";const e={totalOffices:document.getElementById("totalOffices"),activeOffices:document.getElementById("activeOffices"),inactiveOffices:document.getElementById("inactiveOffices"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),officeModal:document.getElementById("officeModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),officeForm:document.getElementById("officeForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),officeName:document.getElementById("office_name"),officeAddress:document.getElementById("office_address"),status:document.getElementById("status")};document.addEventListener("DOMContentLoaded",function(){var t,a,i,o,s,n;b(),p(),(t=document.getElementById("loadDataBtn"))==null||t.addEventListener("click",p),(a=document.getElementById("create_new"))==null||a.addEventListener("click",openCreateModal),(i=document.getElementById("resetFilters"))==null||i.addEventListener("click",O),document.querySelectorAll(".toggle-btn").forEach(r=>{r.addEventListener("click",function(){l=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(v=>v.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),l==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",m(d)):l==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",m(d)):l==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",m(d)):l==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",E(d))})}),(o=e.statusFilter)==null||o.addEventListener("change",function(){g(this.value)}),(s=e.officeForm)==null||s.addEventListener("submit",function(r){r.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',A())}),(n=e.modalOverlay)==null||n.addEventListener("click",closeOfficeModal)});function O(){e.statusFilter.value="all",g("all")}async function b(){try{const a=await(await fetch(window.officeRoutes.stats,{headers:{"X-CSRF-TOKEN":y,Accept:"application/json"}})).json();e.totalOffices.textContent=a.total,e.activeOffices.textContent=a.active,e.inactiveOffices.textContent=a.inactive}catch(t){console.error("Error loading stats:",t)}}async function p(){try{f=(await(await fetch(window.officeRoutes.data,{headers:{"X-CSRF-TOKEN":y,Accept:"application/json"}})).json()).data||[],d=f,m(d),E(d)}catch(t){console.error("Error loading offices:",t)}}function g(t){t==="all"?d=f:t==="active"?d=f.filter(a=>a.status==1):t==="inactive"&&(d=f.filter(a=>a.status==0)),d.length===0&&t!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),l==="cards"||l==="grid"||l==="list"?m(d):E(d))}function m(t){if(t.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Offices Found</h3>
                <p>Get started by adding your first office to the system</p>
            </div>
        `;return}let a="";t.forEach(function(i,o){const s=i.status==1?"active":"inactive",n=i.status==1?"Active":"Inactive",r=new Date(i.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});a+=`
            <div class="office-card" data-status="${s}" data-id="${i.id}">
                <div class="card-header">
                    <div class="office-meta">
                        <span class="office-id">Office #${i.id}</span>
                        <span class="office-date">${r}</span>
                    </div>
                    <div class="status-badge ${s}">
                        ${n}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="office-name">${i.office_name}</h5>
                    <div class="office-details">
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">${i.office_address}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${i.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        ${window.userPermissions>0?`<button class="action-btn-small edit edit_data" data-id="${i.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>`:""}
                        ${window.userPermissions===1?`<button class="action-btn-small delete delete_data" data-id="${i.id}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>`:""}
                    </div>
                </div>
            </div>
        `}),e.cardView.innerHTML=a,B()}function E(t){var i;if(t.length===0){e.tableBody.innerHTML=`
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <h3>No Offices Found</h3>
                        <p>Get started by adding your first office to the system</p>
                        <button class="control-btn primary" id="create_new_empty_table">
                            <i class="fas fa-plus-circle"></i>
                            Add New Office
                        </button>
                    </div>
                </td>
            </tr>
        `,(i=document.getElementById("create_new_empty_table"))==null||i.addEventListener("click",openCreateModal);return}let a="";t.forEach(function(o,s){const n=o.status==1?"active":"inactive",r=o.status==1?"Active":"Inactive";new Date(o.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),a+=`
            <tr data-status="${n}" data-id="${o.id}">
                <td class="text-center">${o.id}</td>
                <td><strong>${o.office_name}</strong></td>
                <td>${o.office_address}</td>
                <td class="text-center">
                    <span class="status-badge ${n}">${r}</span>
                </td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-btn">
                            <i class="fas fa-ellipsis-v"></i>
                            Actions
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item view_data" data-id="${o.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </a>
                            ${window.userPermissions>0?`<div class="dropdown-divider"></div>
                            <button class="dropdown-item edit_data" data-id="${o.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>`:""}
                            ${window.userPermissions===1?`<div class="dropdown-divider"></div>
                            <button class="dropdown-item delete_data" data-id="${o.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </td>
            </tr>
        `}),e.tableBody.innerHTML=a,S()}function B(){document.querySelectorAll(".view_data").forEach(t=>{t.addEventListener("click",function(){const a=this.dataset.id;openViewModal(a)})}),document.querySelectorAll(".edit_data").forEach(t=>{t.addEventListener("click",function(){const a=this.dataset.id;openEditModal(a)})}),document.querySelectorAll(".delete_data").forEach(t=>{t.addEventListener("click",function(){const a=this.dataset.id;confirm("Are you sure you want to delete this office?")&&L(a)})})}function S(){document.querySelectorAll(".action-btn").forEach(t=>{t.addEventListener("click",function(a){a.stopPropagation();const i=this.nextElementSibling;i&&i.classList.toggle("show")})}),document.addEventListener("click",function(t){t.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(a=>{a.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(t=>{t.addEventListener("click",function(){const a=this.dataset.id;openViewModal(a)})}),document.querySelectorAll(".edit_data").forEach(t=>{t.addEventListener("click",function(){const a=this.dataset.id;openEditModal(a)})}),document.querySelectorAll(".delete_data").forEach(t=>{t.addEventListener("click",function(){const a=this.dataset.id;confirm("Are you sure you want to delete this office?")&&L(a)})})}window.openCreateModal=function(){w="create",e.modalTitle.textContent="Create New Office",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save Office',e.formMethod.value="POST",e.officeForm.action=window.officeRoutes.store,e.officeForm.reset(),document.querySelectorAll(".error-message").forEach(t=>t.textContent=""),document.querySelectorAll(".form-control").forEach(t=>t.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.officeForm.style.display="block",e.officeModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.officeModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(t){w="edit";const a=f.find(i=>i.id==t);a&&(e.modalTitle.textContent="Edit Office",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update Office',e.formMethod.value="PUT",e.officeForm.action=window.officeRoutes.base+t,e.officeName.value=a.office_name,e.officeAddress.value=a.office_address,e.status.value=a.status,document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.officeForm.style.display="block",e.officeModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.officeModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(t){w="view";const a=f.find(i=>i.id==t);a&&(e.modalTitle.textContent="View Office Details",e.submitBtn.style.display="none",e.officeName.value=a.office_name,e.officeName.setAttribute("readonly",!0),e.officeName.classList.add("view-only-field"),e.officeAddress.value=a.office_address,e.officeAddress.setAttribute("readonly",!0),e.officeAddress.classList.add("view-only-field"),e.status.value=a.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.createdDateDisplay.textContent=new Date(a.created_at).toLocaleString(),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.officeForm.style.display="block",e.officeModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.officeModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeOfficeModal=function(){c.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),c.to(e.officeModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.officeModal.style.display="none",e.officeForm.reset(),document.querySelectorAll(".form-control").forEach(t=>{t.removeAttribute("readonly"),t.removeAttribute("disabled"),t.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(t=>t.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function A(){if(w==="view")return;const t=e.officeForm.action,a=e.formMethod.value,i={office_name:e.officeName.value,office_address:e.officeAddress.value,status:e.status.value,_token:y};a==="PUT"&&(i._method="PUT");try{const o=await fetch(t,{method:"POST",headers:{"X-CSRF-TOKEN":y,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(i)}),s=await o.json();if(!o.ok)throw new Error(s.message||"Request failed");b(),p(),closeOfficeModal(),u.fire({title:"Success!",text:s.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(o){if(console.error("Error:",o),o.message&&o.message.includes("validation")){try{const s=JSON.parse(o.message);s.errors&&Object.keys(s.errors).forEach(n=>{const r=document.getElementById(n+"-error"),v=document.getElementById(n);r&&(r.textContent=s.errors[n][0]),v&&v.classList.add("error")})}catch{}u.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else u.fire({title:"Error!",text:o.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1}}async function L(t){try{if(!(await fetch(window.officeRoutes.base+t,{method:"DELETE",headers:{"X-CSRF-TOKEN":y,Accept:"application/json"}})).ok)throw new Error("Delete failed");b(),p(),u.fire({title:"Deleted!",text:"Office has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(a){console.error("Error:",a),u.fire({title:"Error!",text:"Error deleting office",icon:"error"})}}
