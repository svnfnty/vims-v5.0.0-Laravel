import{g as d}from"./index-CB87Sc6I.js";import{S as p}from"./sweetalert2.esm.all-BoFtKDfH.js";var I;const w=((I=document.querySelector('meta[name="csrf-token"]'))==null?void 0:I.getAttribute("content"))||"";let m=[],n=[],u="cards",f="create";const e={totalWalkins:document.getElementById("totalWalkins"),activeWalkins:document.getElementById("activeWalkins"),inactiveWalkins:document.getElementById("inactiveWalkins"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),walkinModal:document.getElementById("walkinModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),walkinForm:document.getElementById("walkinForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),email:document.getElementById("email"),accountID:document.getElementById("accountID"),name:document.getElementById("name"),color:document.getElementById("color"),description:document.getElementById("description"),status:document.getElementById("status"),officeId:document.getElementById("office_id"),officeSelectGroup:document.getElementById("officeSelectGroup")};document.addEventListener("DOMContentLoaded",function(){var a,t,i,o,s,l;g(),b(),(a=document.getElementById("loadDataBtn"))==null||a.addEventListener("click",b),(t=document.getElementById("create_new"))==null||t.addEventListener("click",openCreateModal),(i=document.getElementById("resetFilters"))==null||i.addEventListener("click",B),document.querySelectorAll(".toggle-btn").forEach(c=>{c.addEventListener("click",function(){u=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(r=>r.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),u==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",v(n)):u==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",v(n)):u==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",v(n)):u==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",k(n))})}),(o=e.statusFilter)==null||o.addEventListener("change",function(){L(this.value)}),(s=e.walkinForm)==null||s.addEventListener("submit",function(c){c.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',$())}),(l=e.modalOverlay)==null||l.addEventListener("click",closeWalkinModal),e.walkinForm&&e.walkinForm.addEventListener("submit",function(){window.dispatchEvent(new CustomEvent("tutorial:actionCompleted",{detail:{step:1,action:"walkin_created"}}))})});function B(){e.statusFilter.value="all",L("all")}async function g(){try{const t=await(await fetch(window.walkinRoutes.stats,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json();e.totalWalkins.textContent=t.total,e.activeWalkins.textContent=t.active,e.inactiveWalkins.textContent=t.inactive}catch(a){console.error("Error loading stats:",a)}}async function b(){try{m=(await(await fetch(window.walkinRoutes.data,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json()).data||[],n=m,v(n),k(n)}catch(a){console.error("Error loading walkins:",a)}}function L(a){a==="all"?n=m:a==="active"?n=m.filter(t=>t.status==1):a==="inactive"&&(n=m.filter(t=>t.status==0)),n.length===0&&a!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),u==="cards"||u==="grid"||u==="list"?v(n):k(n))}function v(a){if(a.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Walkins Found</h3>
                <p>Get started by adding your first walkin to the system</p>
            </div>
        `;return}let t="";a.forEach(function(i,o){const s=i.status==1?"active":"inactive",l=i.status==1?"Active":"Inactive",c=i.email||'<span style="color: var(--gray);">No email</span>',r=new Date(i.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),E=window.userId===1&&window.userOfficeId===0,y=i.office?i.office.office_name:"N/A",h=E?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${y}</span>
            </div>
        `:"";t+=`
            <div class="walkin-card" data-status="${s}" data-office="${y}" data-id="${i.id}">
                <div class="card-header">
                    <div class="walkin-meta">
                        <span class="walkin-id">Walkin #${i.id}</span>
                        <span class="walkin-date">${r}</span>
                    </div>
                    <div class="status-badge ${s}">
                        ${l}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="walkin-name">${i.name}</h5>
                    <div class="walkin-details">
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${c}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Account ID:</span>
                            <span class="detail-value">${i.accountID}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Color:</span>
                            <span class="detail-value">${i.color}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Description:</span>
                            <span class="detail-value">${i.description}</span>
                        </div>
                        ${h}
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
        `}),e.cardView.innerHTML=t,A()}function k(a){var i;if(a.length===0){const s=window.userId===1&&window.userOfficeId===0?9:8;e.tableBody.innerHTML=`
            <tr>
                <td colspan="${s}">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>No Walkins Found</h3>
                        <p>Get started by adding your first walkin to the system</p>
                        <button class="control-btn primary" id="create_new_empty_table">
                            <i class="fas fa-plus-circle"></i>
                            Add New Walkin
                        </button>
                    </div>
                </td>
            </tr>
        `,(i=document.getElementById("create_new_empty_table"))==null||i.addEventListener("click",openCreateModal);return}let t="";a.forEach(function(o,s){const l=o.status==1?"active":"inactive",c=o.status==1?"Active":"Inactive",r=o.email||'<span style="color: var(--gray);">No email</span>',E=window.userId===1&&window.userOfficeId===0,y=o.office?o.office.office_name:"N/A",h=E?`<td>${y}</td>`:"";t+=`
            <tr data-status="${l}" data-office="${y}" data-id="${o.id}">
                <td class="text-center">${o.id}</td>
                <td>${r}</td>
                <td>${o.accountID}</td>
                <td><strong>${o.name}</strong></td>
                <td>${o.color}</td>
                <td class="text-center">
                    <span class="status-badge ${l}">${c}</span>
                </td>
                <td>${o.description}</td>
                ${h}
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
        `}),e.tableBody.innerHTML=t,D()}function A(){document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openEditModal(t)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;confirm("Are you sure you want to delete this walkin?")&&S(t)})})}function D(){document.querySelectorAll(".action-btn").forEach(a=>{a.addEventListener("click",function(t){t.stopPropagation();const i=this.nextElementSibling;i&&i.classList.toggle("show")})}),document.addEventListener("click",function(a){a.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown .dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openEditModal(t)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;confirm("Are you sure you want to delete this walkin?")&&S(t)})})}window.openCreateModal=function(){f="create",e.modalTitle.textContent="Create New Walkin",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save Walkin',e.formMethod.value="POST",e.walkinForm.action=window.walkinRoutes.store,e.walkinForm.reset(),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),document.querySelectorAll(".form-control").forEach(a=>a.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.walkinForm.style.display="block",window.isSuperAdmin&&e.officeSelectGroup&&(e.officeSelectGroup.style.display="block"),e.walkinModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.walkinModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(a){f="edit";const t=m.find(i=>i.id==a);t&&(e.modalTitle.textContent="Edit Walkin",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update Walkin',e.formMethod.value="PUT",e.walkinForm.action=window.walkinRoutes.base+a,e.email.value=t.email,e.accountID.value=t.accountID,e.name.value=t.name,e.color.value=t.color,e.description.value=t.description,e.status.value=t.status,document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.walkinForm.style.display="block",e.officeSelectGroup&&(e.officeSelectGroup.style.display="none"),e.walkinModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.walkinModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(a){f="view";const t=m.find(i=>i.id==a);t&&(e.modalTitle.textContent="View Walkin Details",e.submitBtn.style.display="none",e.email.value=t.email,e.email.setAttribute("readonly",!0),e.email.classList.add("view-only-field"),e.accountID.value=t.accountID,e.accountID.setAttribute("readonly",!0),e.accountID.classList.add("view-only-field"),e.name.value=t.name,e.name.setAttribute("readonly",!0),e.name.classList.add("view-only-field"),e.color.value=t.color,e.color.setAttribute("readonly",!0),e.color.classList.add("view-only-field"),e.description.value=t.description,e.description.setAttribute("readonly",!0),e.description.classList.add("view-only-field"),e.officeId&&(e.officeId.value=t.office_id,e.officeId.setAttribute("disabled",!0),e.officeId.classList.add("view-only-select")),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.createdDateDisplay.textContent=new Date(t.created_at).toLocaleString(),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.walkinForm.style.display="block",e.walkinModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.walkinModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeWalkinModal=function(){d.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),d.to(e.walkinModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.walkinModal.style.display="none",e.walkinForm.reset(),document.querySelectorAll(".form-control").forEach(a=>{a.removeAttribute("readonly"),a.removeAttribute("disabled"),a.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function $(){if(f==="view")return;const a=e.walkinForm.action,t=e.formMethod.value,i={email:e.email.value,accountID:e.accountID.value,name:e.name.value,color:e.color.value,description:e.description.value,status:e.status.value,_token:w};if(window.isSuperAdmin&&f==="create"&&e.officeId){const o=e.officeId.value;o&&(i.office_id=o)}else!window.isSuperAdmin&&e.officeId&&(i.office_id=e.officeId.value);t==="PUT"&&(i._method="PUT");try{const o=await fetch(a,{method:"POST",headers:{"X-CSRF-TOKEN":w,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(i)}),s=await o.json();if(!o.ok)throw new Error(s.message||"Request failed");g(),b(),closeWalkinModal(),p.fire({title:"Success!",text:s.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(o){if(console.error("Error:",o),o.message&&o.message.includes("validation")){try{const s=JSON.parse(o.message);s.errors&&Object.keys(s.errors).forEach(l=>{const c=document.getElementById(l+"-error"),r=document.getElementById(l);c&&(c.textContent=s.errors[l][0]),r&&r.classList.add("error")})}catch{}p.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else p.fire({title:"Error!",text:o.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1,e.submitBtn.innerHTML='<i class="fas fa-save"></i> '+(f==="create"?"Save Walkin":"Update Walkin")}}async function S(a){try{if(!(await fetch(window.walkinRoutes.base+a,{method:"DELETE",headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).ok)throw new Error("Delete failed");g(),b(),p.fire({title:"Deleted!",text:"Walkin has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),p.fire({title:"Error!",text:"Error deleting walkin",icon:"error"})}}
