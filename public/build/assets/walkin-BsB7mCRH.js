import{g as d}from"./index-CB87Sc6I.js";import{S as f}from"./sweetalert2.esm.all-BoFtKDfH.js";var B;const v=((B=document.querySelector('meta[name="csrf-token"]'))==null?void 0:B.getAttribute("content"))||"";function b(a="perform this action"){if(window.userPermissions===0)return f.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${a}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1;if(!window.currentUserSubscription||!window.currentUserSubscription.subscription_type)return f.fire({title:"Subscription Required!",text:`You don't have an active subscription. Please subscribe to ${a}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Subscribe Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1;if(window.currentUserSubscription.subscription_type==="free_trial"){const t=window.currentUserSubscription.subscription_end_date?new Date(window.currentUserSubscription.subscription_end_date):window.currentUserSubscription.last_payment_date?new Date(new Date(window.currentUserSubscription.last_payment_date).setMonth(new Date(window.currentUserSubscription.last_payment_date).getMonth()+1)):null;if(t&&new Date>t)return f.fire({title:"Free Trial Ended!",text:`Your free trial has ended. Please upgrade your subscription to ${a}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Upgrade Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(i=>{i.isConfirmed&&(window.location.href="/account/setting")}),!1}return!0}let m=[],l=[],u="cards",p="create";const e={totalWalkins:document.getElementById("totalWalkins"),activeWalkins:document.getElementById("activeWalkins"),inactiveWalkins:document.getElementById("inactiveWalkins"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),walkinModal:document.getElementById("walkinModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),walkinForm:document.getElementById("walkinForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),email:document.getElementById("email"),accountID:document.getElementById("accountID"),name:document.getElementById("name"),color:document.getElementById("color"),description:document.getElementById("description"),status:document.getElementById("status"),officeId:document.getElementById("office_id"),officeSelectGroup:document.getElementById("officeSelectGroup")};document.addEventListener("DOMContentLoaded",function(){var a,t,i,o,n,r;k(),h(),(a=document.getElementById("loadDataBtn"))==null||a.addEventListener("click",h),(t=document.getElementById("create_new"))==null||t.addEventListener("click",function(s){if(!b("create new walkins")){s.preventDefault(),s.stopPropagation();return}openCreateModal()}),(i=document.getElementById("resetFilters"))==null||i.addEventListener("click",D),document.querySelectorAll(".toggle-btn").forEach(s=>{s.addEventListener("click",function(){u=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(c=>c.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),u==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",w(l)):u==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",w(l)):u==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",w(l)):u==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",S(l))})}),(o=e.statusFilter)==null||o.addEventListener("change",function(){I(this.value)}),(n=e.walkinForm)==null||n.addEventListener("submit",function(s){s.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',T())}),(r=e.modalOverlay)==null||r.addEventListener("click",closeWalkinModal),e.walkinForm&&e.walkinForm.addEventListener("submit",function(){window.dispatchEvent(new CustomEvent("tutorial:actionCompleted",{detail:{step:1,action:"walkin_created"}}))})});function D(){e.statusFilter.value="all",I("all")}async function k(){try{const t=await(await fetch(window.walkinRoutes.stats,{headers:{"X-CSRF-TOKEN":v,Accept:"application/json"}})).json();e.totalWalkins.textContent=t.total,e.activeWalkins.textContent=t.active,e.inactiveWalkins.textContent=t.inactive}catch(a){console.error("Error loading stats:",a)}}async function h(){try{m=(await(await fetch(window.walkinRoutes.data,{headers:{"X-CSRF-TOKEN":v,Accept:"application/json"}})).json()).data||[],l=m,w(l),S(l)}catch(a){console.error("Error loading walkins:",a)}}function I(a){a==="all"?l=m:a==="active"?l=m.filter(t=>t.status==1):a==="inactive"&&(l=m.filter(t=>t.status==0)),l.length===0&&a!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),u==="cards"||u==="grid"||u==="list"?w(l):S(l))}function w(a){if(a.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Walkins Found</h3>
                <p>Get started by adding your first walkin to the system</p>
            </div>
        `;return}let t="";a.forEach(function(i,o){const n=i.status==1?"active":"inactive",r=i.status==1?"Active":"Inactive",s=i.email||'<span style="color: var(--gray);">No email</span>',c=new Date(i.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),E=window.userId===1&&window.userOfficeId===0,y=i.office?i.office.office_name:"N/A",g=E?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${y}</span>
            </div>
        `:"";t+=`
            <div class="walkin-card" data-status="${n}" data-office="${y}" data-id="${i.id}">
                <div class="card-header">
                    <div class="walkin-meta">
                        <span class="walkin-id">Walkin #${i.id}</span>
                        <span class="walkin-date">${c}</span>
                    </div>
                    <div class="status-badge ${n}">
                        ${r}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="walkin-name">${i.name}</h5>
                    <div class="walkin-details">
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${s}</span>
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
                        ${g}
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
        `}),e.cardView.innerHTML=t,A()}function S(a){var i;if(a.length===0){const n=window.userId===1&&window.userOfficeId===0?9:8;e.tableBody.innerHTML=`
            <tr>
                <td colspan="${n}">
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
        `,(i=document.getElementById("create_new_empty_table"))==null||i.addEventListener("click",openCreateModal);return}let t="";a.forEach(function(o,n){const r=o.status==1?"active":"inactive",s=o.status==1?"Active":"Inactive",c=o.email||'<span style="color: var(--gray);">No email</span>',E=window.userId===1&&window.userOfficeId===0,y=o.office?o.office.office_name:"N/A",g=E?`<td>${y}</td>`:"";t+=`
            <tr data-status="${r}" data-office="${y}" data-id="${o.id}">
                <td class="text-center">${o.id}</td>
                <td>${c}</td>
                <td>${o.accountID}</td>
                <td><strong>${o.name}</strong></td>
                <td>${o.color}</td>
                <td class="text-center">
                    <span class="status-badge ${r}">${s}</span>
                </td>
                <td>${o.description}</td>
                ${g}
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
        `}),e.tableBody.innerHTML=t,C()}function A(){document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("edit walkins")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;openEditModal(i)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("delete walkins")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;confirm("Are you sure you want to delete this walkin?")&&L(i)})})}function C(){document.querySelectorAll(".action-btn").forEach(a=>{a.addEventListener("click",function(t){t.stopPropagation();const i=this.nextElementSibling;i&&i.classList.toggle("show")})}),document.addEventListener("click",function(a){a.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown .dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("edit walkins")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;openEditModal(i)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("delete walkins")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;confirm("Are you sure you want to delete this walkin?")&&L(i)})})}window.openCreateModal=function(){p="create",e.modalTitle.textContent="Create New Walkin",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save Walkin',e.formMethod.value="POST",e.walkinForm.action=window.walkinRoutes.store,e.walkinForm.reset(),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),document.querySelectorAll(".form-control").forEach(a=>a.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.walkinForm.style.display="block",window.isSuperAdmin&&e.officeSelectGroup&&(e.officeSelectGroup.style.display="block"),e.walkinModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.walkinModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(a){p="edit";const t=m.find(i=>i.id==a);t&&(e.modalTitle.textContent="Edit Walkin",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update Walkin',e.formMethod.value="PUT",e.walkinForm.action=window.walkinRoutes.base+a,e.email.value=t.email,e.accountID.value=t.accountID,e.name.value=t.name,e.color.value=t.color,e.description.value=t.description,e.status.value=t.status,document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.walkinForm.style.display="block",e.officeSelectGroup&&(e.officeSelectGroup.style.display="none"),e.walkinModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.walkinModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(a){p="view";const t=m.find(i=>i.id==a);t&&(e.modalTitle.textContent="View Walkin Details",e.submitBtn.style.display="none",e.email.value=t.email,e.email.setAttribute("readonly",!0),e.email.classList.add("view-only-field"),e.accountID.value=t.accountID,e.accountID.setAttribute("readonly",!0),e.accountID.classList.add("view-only-field"),e.name.value=t.name,e.name.setAttribute("readonly",!0),e.name.classList.add("view-only-field"),e.color.value=t.color,e.color.setAttribute("readonly",!0),e.color.classList.add("view-only-field"),e.description.value=t.description,e.description.setAttribute("readonly",!0),e.description.classList.add("view-only-field"),e.officeId&&(e.officeId.value=t.office_id,e.officeId.setAttribute("disabled",!0),e.officeId.classList.add("view-only-select")),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.createdDateDisplay.textContent=new Date(t.created_at).toLocaleString(),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.walkinForm.style.display="block",e.walkinModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.walkinModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeWalkinModal=function(){d.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),d.to(e.walkinModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.walkinModal.style.display="none",e.walkinForm.reset(),document.querySelectorAll(".form-control").forEach(a=>{a.removeAttribute("readonly"),a.removeAttribute("disabled"),a.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function T(){if(p==="view")return;const a=e.walkinForm.action,t=e.formMethod.value,i={email:e.email.value,accountID:e.accountID.value,name:e.name.value,color:e.color.value,description:e.description.value,status:e.status.value,_token:v};if(window.isSuperAdmin&&p==="create"&&e.officeId){const o=e.officeId.value;o&&(i.office_id=o)}else!window.isSuperAdmin&&e.officeId&&(i.office_id=e.officeId.value);t==="PUT"&&(i._method="PUT");try{const o=await fetch(a,{method:"POST",headers:{"X-CSRF-TOKEN":v,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(i)}),n=await o.json();if(!o.ok)throw new Error(n.message||"Request failed");k(),h(),closeWalkinModal(),f.fire({title:"Success!",text:n.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(o){if(console.error("Error:",o),o.message&&o.message.includes("validation")){try{const n=JSON.parse(o.message);n.errors&&Object.keys(n.errors).forEach(r=>{const s=document.getElementById(r+"-error"),c=document.getElementById(r);s&&(s.textContent=n.errors[r][0]),c&&c.classList.add("error")})}catch{}f.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else f.fire({title:"Error!",text:o.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1,e.submitBtn.innerHTML='<i class="fas fa-save"></i> '+(p==="create"?"Save Walkin":"Update Walkin")}}async function L(a){try{if(!(await fetch(window.walkinRoutes.base+a,{method:"DELETE",headers:{"X-CSRF-TOKEN":v,Accept:"application/json"}})).ok)throw new Error("Delete failed");k(),h(),f.fire({title:"Deleted!",text:"Walkin has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),f.fire({title:"Error!",text:"Error deleting walkin",icon:"error"})}}
