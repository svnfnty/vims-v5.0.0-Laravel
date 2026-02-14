import{g as d}from"./index-CB87Sc6I.js";import{S as f}from"./sweetalert2.esm.all-BoFtKDfH.js";var E;const y=((E=document.querySelector('meta[name="csrf-token"]'))==null?void 0:E.getAttribute("content"))||"";function p(i="perform this action"){if(window.userPermissions===0)return f.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${i}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1;if(!window.currentUserSubscription||!window.currentUserSubscription.subscription_type)return f.fire({title:"Subscription Required!",text:`You don't have an active subscription. Please subscribe to ${i}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Subscribe Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1;if(window.currentUserSubscription.subscription_type==="free_trial"){const t=window.currentUserSubscription.subscription_end_date?new Date(window.currentUserSubscription.subscription_end_date):window.currentUserSubscription.last_payment_date?new Date(new Date(window.currentUserSubscription.last_payment_date).setMonth(new Date(window.currentUserSubscription.last_payment_date).getMonth()+1)):null;if(t&&new Date>t)return f.fire({title:"Free Trial Ended!",text:`Your free trial has ended. Please upgrade your subscription to ${i}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Upgrade Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(o=>{o.isConfirmed&&(window.location.href="/account/setting")}),!1}return!0}let u=[],r=[],l="cards",b="create";const e={totalOffices:document.getElementById("totalOffices"),activeOffices:document.getElementById("activeOffices"),inactiveOffices:document.getElementById("inactiveOffices"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),officeModal:document.getElementById("officeModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),officeForm:document.getElementById("officeForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),officeName:document.getElementById("office_name"),officeAddress:document.getElementById("office_address"),status:document.getElementById("status")};document.addEventListener("DOMContentLoaded",function(){var i,t,o,a,s,c;h(),v(),(i=document.getElementById("loadDataBtn"))==null||i.addEventListener("click",v),(t=document.getElementById("create_new"))==null||t.addEventListener("click",function(n){if(!p("create new offices")){n.preventDefault(),n.stopPropagation();return}openCreateModal()}),(o=document.getElementById("resetFilters"))==null||o.addEventListener("click",L),document.querySelectorAll(".toggle-btn").forEach(n=>{n.addEventListener("click",function(){l=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(w=>w.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),l==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",m(r)):l==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",m(r)):l==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",m(r)):l==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",g(r))})}),(a=e.statusFilter)==null||a.addEventListener("change",function(){B(this.value)}),(s=e.officeForm)==null||s.addEventListener("submit",function(n){n.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',C())}),(c=e.modalOverlay)==null||c.addEventListener("click",closeOfficeModal)});function L(){e.statusFilter.value="all",B("all")}async function h(){try{const t=await(await fetch(window.officeRoutes.stats,{headers:{"X-CSRF-TOKEN":y,Accept:"application/json"}})).json();e.totalOffices.textContent=t.total,e.activeOffices.textContent=t.active,e.inactiveOffices.textContent=t.inactive}catch(i){console.error("Error loading stats:",i)}}async function v(){try{u=(await(await fetch(window.officeRoutes.data,{headers:{"X-CSRF-TOKEN":y,Accept:"application/json"}})).json()).data||[],r=u,m(r),g(r)}catch(i){console.error("Error loading offices:",i)}}function B(i){i==="all"?r=u:i==="active"?r=u.filter(t=>t.status==1):i==="inactive"&&(r=u.filter(t=>t.status==0)),r.length===0&&i!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),l==="cards"||l==="grid"||l==="list"?m(r):g(r))}function m(i){if(i.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Offices Found</h3>
                <p>Get started by adding your first office to the system</p>
            </div>
        `;return}let t="";i.forEach(function(o,a){const s=o.status==1?"active":"inactive",c=o.status==1?"Active":"Inactive",n=new Date(o.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});t+=`
            <div class="office-card" data-status="${s}" data-id="${o.id}">
                <div class="card-header">
                    <div class="office-meta">
                        <span class="office-id">Office #${o.id}</span>
                        <span class="office-date">${n}</span>
                    </div>
                    <div class="status-badge ${s}">
                        ${c}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="office-name">${o.office_name}</h5>
                    <div class="office-details">
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">${o.office_address}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${o.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        ${window.userPermissions>0?`<button class="action-btn-small edit edit_data" data-id="${o.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>`:""}
                        ${window.userPermissions===1?`<button class="action-btn-small delete delete_data" data-id="${o.id}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>`:""}
                    </div>
                </div>
            </div>
        `}),e.cardView.innerHTML=t,O()}function g(i){var o;if(i.length===0){e.tableBody.innerHTML=`
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
        `,(o=document.getElementById("create_new_empty_table"))==null||o.addEventListener("click",openCreateModal);return}let t="";i.forEach(function(a,s){const c=a.status==1?"active":"inactive",n=a.status==1?"Active":"Inactive";new Date(a.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),t+=`
            <tr data-status="${c}" data-id="${a.id}">
                <td class="text-center">${a.id}</td>
                <td><strong>${a.office_name}</strong></td>
                <td>${a.office_address}</td>
                <td class="text-center">
                    <span class="status-badge ${c}">${n}</span>
                </td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-btn">
                            <i class="fas fa-ellipsis-v"></i>
                            Actions
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item view_data" data-id="${a.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </a>
                            ${window.userPermissions>0?`<div class="dropdown-divider"></div>
                            <button class="dropdown-item edit_data" data-id="${a.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>`:""}
                            ${window.userPermissions===1?`<div class="dropdown-divider"></div>
                            <button class="dropdown-item delete_data" data-id="${a.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </td>
            </tr>
        `}),e.tableBody.innerHTML=t,_()}function O(){document.querySelectorAll(".view_data").forEach(i=>{i.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(i=>{i.addEventListener("click",function(t){if(!p("edit offices")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;openEditModal(o)})}),document.querySelectorAll(".delete_data").forEach(i=>{i.addEventListener("click",function(t){if(!p("delete offices")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;confirm("Are you sure you want to delete this office?")&&S(o)})})}function _(){document.querySelectorAll(".action-btn").forEach(i=>{i.addEventListener("click",function(t){t.stopPropagation();const o=this.nextElementSibling;o&&o.classList.toggle("show")})}),document.addEventListener("click",function(i){i.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(i=>{i.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(i=>{i.addEventListener("click",function(t){if(!p("edit offices")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;openEditModal(o)})}),document.querySelectorAll(".delete_data").forEach(i=>{i.addEventListener("click",function(t){if(!p("delete offices")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;confirm("Are you sure you want to delete this office?")&&S(o)})})}window.openCreateModal=function(){b="create",e.modalTitle.textContent="Create New Office",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save Office',e.formMethod.value="POST",e.officeForm.action=window.officeRoutes.store,e.officeForm.reset(),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.officeForm.style.display="block",e.officeModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.officeModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(i){b="edit";const t=u.find(o=>o.id==i);t&&(e.modalTitle.textContent="Edit Office",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update Office',e.formMethod.value="PUT",e.officeForm.action=window.officeRoutes.base+i,e.officeName.value=t.office_name,e.officeAddress.value=t.office_address,e.status.value=t.status,document.querySelectorAll(".error-message").forEach(o=>o.textContent=""),document.querySelectorAll(".form-control").forEach(o=>o.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.officeForm.style.display="block",e.officeModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.officeModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(i){b="view";const t=u.find(o=>o.id==i);t&&(e.modalTitle.textContent="View Office Details",e.submitBtn.style.display="none",e.officeName.value=t.office_name,e.officeName.setAttribute("readonly",!0),e.officeName.classList.add("view-only-field"),e.officeAddress.value=t.office_address,e.officeAddress.setAttribute("readonly",!0),e.officeAddress.classList.add("view-only-field"),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.createdDateDisplay.textContent=new Date(t.created_at).toLocaleString(),document.querySelectorAll(".error-message").forEach(o=>o.textContent=""),document.querySelectorAll(".form-control").forEach(o=>o.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.officeForm.style.display="block",e.officeModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.officeModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeOfficeModal=function(){d.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),d.to(e.officeModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.officeModal.style.display="none",e.officeForm.reset(),document.querySelectorAll(".form-control").forEach(i=>{i.removeAttribute("readonly"),i.removeAttribute("disabled"),i.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function C(){if(b==="view")return;const i=e.officeForm.action,t=e.formMethod.value,o={office_name:e.officeName.value,office_address:e.officeAddress.value,status:e.status.value,_token:y};t==="PUT"&&(o._method="PUT");try{const a=await fetch(i,{method:"POST",headers:{"X-CSRF-TOKEN":y,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(o)}),s=await a.json();if(!a.ok)throw new Error(s.message||"Request failed");h(),v(),closeOfficeModal(),f.fire({title:"Success!",text:s.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(a){if(console.error("Error:",a),a.message&&a.message.includes("validation")){try{const s=JSON.parse(a.message);s.errors&&Object.keys(s.errors).forEach(c=>{const n=document.getElementById(c+"-error"),w=document.getElementById(c);n&&(n.textContent=s.errors[c][0]),w&&w.classList.add("error")})}catch{}f.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else f.fire({title:"Error!",text:a.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1}}async function S(i){try{if(!(await fetch(window.officeRoutes.base+i,{method:"DELETE",headers:{"X-CSRF-TOKEN":y,Accept:"application/json"}})).ok)throw new Error("Delete failed");h(),v(),f.fire({title:"Deleted!",text:"Office has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),f.fire({title:"Error!",text:"Error deleting office",icon:"error"})}}
