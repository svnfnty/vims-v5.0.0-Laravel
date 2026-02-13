import{g as c}from"./index-CB87Sc6I.js";import{S as b}from"./sweetalert2.esm.all-BoFtKDfH.js";var M;const w=((M=document.querySelector('meta[name="csrf-token"]'))==null?void 0:M.getAttribute("content"))||"";let u=[],o=[],p="cards",L="create";const e={totalUsers:document.getElementById("totalUsers"),activeUsers:document.getElementById("activeUsers"),inactiveUsers:document.getElementById("inactiveUsers"),subscribedUsers:document.getElementById("subscribedUsers"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),userModal:document.getElementById("userModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),userForm:document.getElementById("userForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),firstname:document.getElementById("firstname"),middlename:document.getElementById("middlename"),lastname:document.getElementById("lastname"),username:document.getElementById("username"),email:document.getElementById("email"),password:document.getElementById("password"),avatar:document.getElementById("avatar"),type:document.getElementById("type"),status:document.getElementById("status"),permissions:document.getElementById("permissions"),credit:document.getElementById("credit"),office:document.getElementById("office"),subscription_type:document.getElementById("subscription_type"),subscription_start_date:document.getElementById("subscription_start_date"),subscription_end_date:document.getElementById("subscription_end_date"),last_payment_date:document.getElementById("last_payment_date"),subscription_amount:document.getElementById("subscription_amount")};function T(a){if(!a)return"N/A";const t=window.offices.find(s=>s.id==a);return t?t.office_name:"N/A"}function g(a="perform this action"){return window.userPermissions===0?(b.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${a}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1):!0}document.addEventListener("DOMContentLoaded",function(){var a,t,s,i,r,l,m;A(),h(),(a=document.getElementById("loadDataBtn"))==null||a.addEventListener("click",h),(t=document.getElementById("create_new"))==null||t.addEventListener("click",function(n){if(!g("create new users")){n.preventDefault(),n.stopPropagation();return}openCreateModal()}),(s=document.getElementById("resetFilters"))==null||s.addEventListener("click",$),(i=e.subscription_type)==null||i.addEventListener("change",function(){const n=this.value;if(!n){e.subscription_start_date&&(e.subscription_start_date.value=""),e.subscription_end_date&&(e.subscription_end_date.value="");return}const f=new Date().toISOString().split("T")[0];let d=new Date;n==="monthly"?d.setMonth(d.getMonth()+1):n==="yearly"?d.setFullYear(d.getFullYear()+1):n==="free_trial"&&d.setDate(d.getDate()+14);const v=d.toISOString().split("T")[0];e.subscription_start_date&&(e.subscription_start_date.value=f),e.subscription_end_date&&(e.subscription_end_date.value=v),e.last_payment_date&&(e.last_payment_date.value=f)}),document.querySelectorAll(".toggle-btn").forEach(n=>{n.addEventListener("click",function(){p=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(y=>y.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),e.cardView.classList.add("users-grid"),p==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",_(o)):p==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",_(o)):p==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",_(o)):p==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",S(o))})}),(r=e.statusFilter)==null||r.addEventListener("change",function(){x(this.value)}),(l=e.userForm)==null||l.addEventListener("submit",function(n){n.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',U())}),(m=e.modalOverlay)==null||m.addEventListener("click",closeUserModal)});function $(){e.statusFilter.value="all",x("all")}async function A(){try{const t=await(await fetch(window.userRoutes.stats,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json();e.totalUsers.textContent=t.total,e.activeUsers.textContent=t.active,e.inactiveUsers.textContent=t.inactive;const s=u.filter(i=>i.subscription_type&&i.subscription_type!=="").length;e.subscribedUsers&&(e.subscribedUsers.textContent=s)}catch(a){console.error("Error loading stats:",a)}}async function h(){try{u=(await(await fetch(window.userRoutes.data,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json()).data||[],o=u,_(o),S(o)}catch(a){console.error("Error loading users:",a)}}function x(a){if(a==="all")o=u;else if(a==="active")o=u.filter(t=>t.status==1);else if(a==="inactive")o=u.filter(t=>t.status==0);else if(a==="subscribed")o=u.filter(t=>t.subscription_type&&t.subscription_type!=="");else if(a==="expired"){const t=new Date;o=u.filter(s=>{if(!s.subscription_type)return!1;const i=s.subscription_end_date?new Date(s.subscription_end_date):s.last_payment_date?new Date(new Date(s.last_payment_date).setMonth(new Date(s.last_payment_date).getMonth()+1)):null;return i&&i<t})}o.length===0&&a!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),p==="cards"||p==="grid"||p==="list"?_(o):S(o))}function _(a){if(a.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Users Found</h3>
                <p>Get started by adding your first user to the system</p>
            </div>
        `;return}let t="";a.forEach(function(s,i){const r=s.status==1?"active":"inactive",l=s.status==1?"Verified":"Not Verified",m=s.type==1?"Admin":"Staff",n=s.firstname+" "+(s.middlename?s.middlename+" ":"")+s.lastname,y=s.email||'<span style="color: var(--gray);">No email</span>',f=new Date(s.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),d=s.permissions==0?"Only View button visible":s.permissions==1?"View, Edit, and Delete buttons visible":"View and Edit buttons visible, Delete hidden";let v="No Subscription",E="badge-secondary";if(s.subscription_type){const C=new Date,D=s.subscription_end_date?new Date(s.subscription_end_date):s.last_payment_date?new Date(new Date(s.last_payment_date).setMonth(new Date(s.last_payment_date).getMonth()+1)):null;if(D){const B=Math.ceil((D-C)/864e5);B<0?(v="Expired",E="badge-danger"):B<=7?(v=`Expires in ${B} days`,E="badge-warning"):(v=`Active (${s.subscription_type})`,E="badge-success")}}t+=`
            <div class="user-card" data-status="${r}" data-id="${s.id}">
                <div class="card-header">
                    <div class="user-meta">
                        <span class="user-id">User #${s.id}</span>
                        <span class="user-date">${f}</span>
                    </div>
                    <div class="status-badge ${r}">
                        ${l}
                    </div>
                </div>

                <div class="card-body">
                    <h3 class="user-name">${n}</h3>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="detail-label">Username:</span>
                            <span class="detail-value">${s.username}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${y}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${m}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Subscription:</span>
                            <span class="detail-value"><span class="badge ${E}">${v}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Permissions:</span>
                            <span class="detail-value">${d}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Credit:</span>
                            <span class="detail-value">${s.credit||0}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Office:</span>
                            <span class="detail-value">${T(s.office_id)}</span>
                        </div>
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
        `}),e.cardView.innerHTML=t,V()}function S(a){var s;if(a.length===0){e.tableBody.innerHTML=`
            <tr>
                <td colspan="11">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>No Users Found</h3>
                        <p>Get started by adding your first user to the system</p>
                        <button class="control-btn primary" id="create_new_empty_table">
                            <i class="fas fa-plus-circle"></i>
                            Add New User
                        </button>
                    </div>
                </td>
            </tr>
        `,(s=document.getElementById("create_new_empty_table"))==null||s.addEventListener("click",openCreateModal);return}let t="";a.forEach(function(i,r){const l=i.status==1?"active":"inactive",m=i.status==1?"Verified":"Not Verified",n=i.firstname+" "+(i.middlename?i.middlename+" ":"")+i.lastname,y=i.email||'<span style="color: var(--gray);">No email</span>',f=i.permissions==0?"No Access":i.permissions==1?"Can Modify":"Can Print";let d='<span class="badge badge-secondary">No Subscription</span>';i.subscription_badge&&(d=i.subscription_badge),t+=`
            <tr data-status="${l}" data-id="${i.id}">
                <td class="text-center">${i.id}</td>
                <td><strong>${n}</strong></td>
                <td>${i.username}</td>
                <td>${y}</td>
                <td>${i.type}</td>
                <td class="text-center">
                    <span class="status-badge ${l}">${m}</span>
                </td>
                <td class="text-center">${d}</td>
                <td>${f}</td>
                <td>${i.credit||0}</td>
                <td>${T(i.office_id)}</td>
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
        `}),e.tableBody.innerHTML=t,k()}function V(){document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(t){if(!g("edit users")){t.preventDefault(),t.stopPropagation();return}const s=this.dataset.id;openEditModal(s)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(t){if(!g("delete users")){t.preventDefault(),t.stopPropagation();return}const s=this.dataset.id;confirm("Are you sure you want to delete this user?")&&I(s)})})}function k(){document.querySelectorAll(".action-btn").forEach(a=>{a.addEventListener("click",function(t){t.stopPropagation();const s=this.nextElementSibling;s&&s.classList.toggle("show")})}),document.addEventListener("click",function(a){a.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown .dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(t){if(!g("edit users")){t.preventDefault(),t.stopPropagation();return}const s=this.dataset.id;openEditModal(s)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(t){if(!g("delete users")){t.preventDefault(),t.stopPropagation();return}const s=this.dataset.id;confirm("Are you sure you want to delete this user?")&&I(s)})})}window.openCreateModal=function(){L="create",e.modalTitle.textContent="Create New User",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save User',e.formMethod.value="POST",e.userForm.action=window.userRoutes.store,e.userForm.reset(),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),document.querySelectorAll(".form-control").forEach(a=>a.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.userForm.style.display="block",e.password&&(e.password.setAttribute("required","required"),e.password.placeholder=" "),e.userModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.userModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(a){L="edit";const t=u.find(s=>s.id==a);t&&(e.modalTitle.textContent="Edit User",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update User',e.formMethod.value="PUT",e.userForm.action=window.userRoutes.base+a,e.password&&(e.password.removeAttribute("required"),e.password.placeholder="Leave empty to keep current password",e.password.value=""),e.firstname.value=t.firstname,e.middlename.value=t.middlename,e.lastname.value=t.lastname,e.username.value=t.username,e.email.value=t.email,e.password.value="",e.avatar.value=t.avatar,e.type.value=t.type,e.status.value=t.status,e.permissions.value=t.permissions,e.credit.value=t.credit,e.office.value=t.office_id,e.subscription_type&&(e.subscription_type.value=t.subscription_type||""),e.subscription_start_date&&(e.subscription_start_date.value=t.subscription_start_date?t.subscription_start_date.split(" ")[0]:""),e.subscription_end_date&&(e.subscription_end_date.value=t.subscription_end_date?t.subscription_end_date.split(" ")[0]:""),e.last_payment_date&&(e.last_payment_date.value=t.last_payment_date?t.last_payment_date.split(" ")[0]:""),e.subscription_amount&&(e.subscription_amount.value=t.subscription_amount||""),document.querySelectorAll(".error-message").forEach(s=>s.textContent=""),document.querySelectorAll(".form-control").forEach(s=>s.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.userForm.style.display="block",e.userModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.userModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(a){L="view";const t=u.find(s=>s.id==a);t&&(e.modalTitle.textContent="View User Details",e.submitBtn.style.display="none",e.firstname.value=t.firstname,e.firstname.setAttribute("readonly",!0),e.firstname.classList.add("view-only-field"),e.middlename.value=t.middlename,e.middlename.setAttribute("readonly",!0),e.middlename.classList.add("view-only-field"),e.lastname.value=t.lastname,e.lastname.setAttribute("readonly",!0),e.lastname.classList.add("view-only-field"),e.username.value=t.username,e.username.setAttribute("readonly",!0),e.username.classList.add("view-only-field"),e.email.value=t.email,e.email.setAttribute("readonly",!0),e.email.classList.add("view-only-field"),e.password.value="",e.password.setAttribute("readonly",!0),e.password.classList.add("view-only-field"),e.avatar.value=t.avatar,e.avatar.setAttribute("readonly",!0),e.avatar.classList.add("view-only-field"),e.type.value=t.type,e.type.setAttribute("disabled",!0),e.type.classList.add("view-only-select"),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.permissions.value=t.permissions,e.permissions.setAttribute("disabled",!0),e.permissions.classList.add("view-only-select"),e.credit.value=t.credit,e.credit.setAttribute("readonly",!0),e.credit.classList.add("view-only-field"),e.office.value=t.office_id,e.office.setAttribute("disabled",!0),e.office.classList.add("view-only-select"),e.subscription_type&&(e.subscription_type.value=t.subscription_type||"",e.subscription_type.setAttribute("disabled",!0),e.subscription_type.classList.add("view-only-select")),e.subscription_start_date&&(e.subscription_start_date.value=t.subscription_start_date?t.subscription_start_date.split(" ")[0]:"",e.subscription_start_date.setAttribute("readonly",!0),e.subscription_start_date.classList.add("view-only-field")),e.subscription_end_date&&(e.subscription_end_date.value=t.subscription_end_date?t.subscription_end_date.split(" ")[0]:"",e.subscription_end_date.setAttribute("readonly",!0),e.subscription_end_date.classList.add("view-only-field")),e.last_payment_date&&(e.last_payment_date.value=t.last_payment_date?t.last_payment_date.split(" ")[0]:"",e.last_payment_date.setAttribute("readonly",!0),e.last_payment_date.classList.add("view-only-field")),e.subscription_amount&&(e.subscription_amount.value=t.subscription_amount||"",e.subscription_amount.setAttribute("readonly",!0),e.subscription_amount.classList.add("view-only-field")),e.createdDateDisplay.textContent=new Date(t.created_at).toLocaleString(),document.querySelectorAll(".error-message").forEach(s=>s.textContent=""),document.querySelectorAll(".form-control").forEach(s=>s.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.userForm.style.display="block",e.userModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.userModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeUserModal=function(){c.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),c.to(e.userModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.userModal.style.display="none",e.userForm.reset(),document.querySelectorAll(".form-control").forEach(a=>{a.removeAttribute("readonly"),a.removeAttribute("disabled"),a.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function U(){if(L==="view")return;const a=e.userForm.action,t=e.formMethod.value,s={firstname:e.firstname.value,middlename:e.middlename.value,lastname:e.lastname.value,username:e.username.value,email:e.email.value,password:e.password.value,avatar:e.avatar.value,type:e.type.value,status:e.status.value,permissions:e.permissions.value,credit:e.credit.value,office_id:e.office.value,subscription_type:e.subscription_type?e.subscription_type.value:"",subscription_start_date:e.subscription_start_date?e.subscription_start_date.value:"",subscription_end_date:e.subscription_end_date?e.subscription_end_date.value:"",last_payment_date:e.last_payment_date?e.last_payment_date.value:"",subscription_amount:e.subscription_amount?e.subscription_amount.value:"",_token:w};t==="PUT"&&(s._method="PUT");try{const i=await fetch(a,{method:"POST",headers:{"X-CSRF-TOKEN":w,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}),r=await i.json();if(!i.ok)throw new Error(r.message||"Request failed");A(),h(),closeUserModal(),b.fire({title:"Success!",text:r.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(i){if(console.error("Error:",i),i.message&&i.message.includes("validation")){try{const r=JSON.parse(i.message);r.errors&&Object.keys(r.errors).forEach(l=>{const m=document.getElementById(l+"-error"),n=document.getElementById(l);m&&(m.textContent=r.errors[l][0]),n&&n.classList.add("error")})}catch{}b.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else b.fire({title:"Error!",text:i.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1}}async function I(a){try{if(!(await fetch(window.userRoutes.base+a,{method:"DELETE",headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).ok)throw new Error("Delete failed");A(),h(),b.fire({title:"Deleted!",text:"User has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),b.fire({title:"Error!",text:"Error deleting user",icon:"error"})}}
