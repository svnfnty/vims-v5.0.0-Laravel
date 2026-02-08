import{g as d,S as f}from"./sweetalert2.esm.all-D1ysrxTe.js";var B;const p=((B=document.querySelector('meta[name="csrf-token"]'))==null?void 0:B.getAttribute("content"))||"";let m=[],n=[],u="cards",w="create";const e={totalUsers:document.getElementById("totalUsers"),activeUsers:document.getElementById("activeUsers"),inactiveUsers:document.getElementById("inactiveUsers"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),userModal:document.getElementById("userModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),userForm:document.getElementById("userForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),firstname:document.getElementById("firstname"),middlename:document.getElementById("middlename"),lastname:document.getElementById("lastname"),username:document.getElementById("username"),email:document.getElementById("email"),password:document.getElementById("password"),avatar:document.getElementById("avatar"),type:document.getElementById("type"),status:document.getElementById("status"),permissions:document.getElementById("permissions"),credit:document.getElementById("credit"),office:document.getElementById("office")};function L(a){if(!a)return"N/A";const t=window.offices.find(s=>s.id==a);return t?t.office_name:"N/A"}document.addEventListener("DOMContentLoaded",function(){var a,t,s,i,o,r;g(),v(),(a=document.getElementById("loadDataBtn"))==null||a.addEventListener("click",v),(t=document.getElementById("create_new"))==null||t.addEventListener("click",openCreateModal),(s=document.getElementById("resetFilters"))==null||s.addEventListener("click",T),document.querySelectorAll(".toggle-btn").forEach(l=>{l.addEventListener("click",function(){u=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(c=>c.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),e.cardView.classList.add("users-grid"),u==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",y(n)):u==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",y(n)):u==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",y(n)):u==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",h(n))})}),(i=e.statusFilter)==null||i.addEventListener("change",function(){A(this.value)}),(o=e.userForm)==null||o.addEventListener("submit",function(l){l.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',k())}),(r=e.modalOverlay)==null||r.addEventListener("click",closeUserModal)});function T(){e.statusFilter.value="all",A("all")}async function g(){try{const t=await(await fetch(window.userRoutes.stats,{headers:{"X-CSRF-TOKEN":p,Accept:"application/json"}})).json();e.totalUsers.textContent=t.total,e.activeUsers.textContent=t.active,e.inactiveUsers.textContent=t.inactive}catch(a){console.error("Error loading stats:",a)}}async function v(){try{m=(await(await fetch(window.userRoutes.data,{headers:{"X-CSRF-TOKEN":p,Accept:"application/json"}})).json()).data||[],n=m,y(n),h(n)}catch(a){console.error("Error loading users:",a)}}function A(a){a==="all"?n=m:a==="active"?n=m.filter(t=>t.status==1):a==="inactive"&&(n=m.filter(t=>t.status==0)),n.length===0&&a!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),u==="cards"||u==="grid"||u==="list"?y(n):h(n))}function y(a){if(a.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Users Found</h3>
                <p>Get started by adding your first user to the system</p>
            </div>
        `;return}let t="";a.forEach(function(s,i){const o=s.status==1?"active":"inactive",r=s.status==1?"Verified":"Not Verified",l=s.type==1?"Admin":"Staff",c=s.firstname+" "+(s.middlename?s.middlename+" ":"")+s.lastname,b=s.email||'<span style="color: var(--gray);">No email</span>',E=new Date(s.created_at).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),M=s.permissions==0?"Only View button visible":s.permissions==1?"View, Edit, and Delete buttons visible":"View and Edit buttons visible, Delete hidden";t+=`
            <div class="user-card" data-status="${o}" data-id="${s.id}">
                <div class="card-header">
                    <div class="user-meta">
                        <span class="user-id">User #${s.id}</span>
                        <span class="user-date">${E}</span>
                    </div>
                    <div class="status-badge ${o}">
                        ${r}
                    </div>
                </div>

                <div class="card-body">
                    <h3 class="user-name">${c}</h3>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="detail-label">Username:</span>
                            <span class="detail-value">${s.username}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${b}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${l}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Permissions:</span>
                            <span class="detail-value">${M}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Credit:</span>
                            <span class="detail-value">${s.credit||0}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Office:</span>
                            <span class="detail-value">${L(s.office_id)}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button disabled class="action-btn-small view view_data" data-id="${s.id}">
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
        `}),e.cardView.innerHTML=t,V()}function h(a){var s;if(a.length===0){e.tableBody.innerHTML=`
            <tr>
                <td colspan="10">
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
        `,(s=document.getElementById("create_new_empty_table"))==null||s.addEventListener("click",openCreateModal);return}let t="";a.forEach(function(i,o){const r=i.status==1?"active":"inactive",l=i.status==1?"Verified":"Not Verified",c=i.firstname+" "+(i.middlename?i.middlename+" ":"")+i.lastname,b=i.email||'<span style="color: var(--gray);">No email</span>',E=i.permissions==0?"No Access":i.permissions==1?"Can Modify":"Can Print";t+=`
            <tr data-status="${r}" data-id="${i.id}">
                <td class="text-center">${i.id}</td>
                <td><strong>${c}</strong></td>
                <td>${i.username}</td>
                <td>${b}</td>
                <td>${i.type}</td>
                <td class="text-center">
                    <span class="status-badge ${r}">${l}</span>
                </td>
                <td>${E}</td>
                <td>${i.credit||0}</td>
                <td>${L(i.office_id)}</td>
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
        `}),e.tableBody.innerHTML=t,$()}function V(){document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openEditModal(t)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;confirm("Are you sure you want to delete this user?")&&S(t)})})}function $(){document.querySelectorAll(".action-btn").forEach(a=>{a.addEventListener("click",function(t){t.stopPropagation();const s=this.nextElementSibling;s&&s.classList.toggle("show")})}),document.addEventListener("click",function(a){a.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown .dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openEditModal(t)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;confirm("Are you sure you want to delete this user?")&&S(t)})})}window.openCreateModal=function(){w="create",e.modalTitle.textContent="Create New User",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save User',e.formMethod.value="POST",e.userForm.action=window.userRoutes.store,e.userForm.reset(),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),document.querySelectorAll(".form-control").forEach(a=>a.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.userForm.style.display="block",e.userModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.userModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(a){w="edit";const t=m.find(s=>s.id==a);t&&(e.modalTitle.textContent="Edit User",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update User',e.formMethod.value="PUT",e.userForm.action=window.userRoutes.base+a,e.firstname.value=t.firstname,e.middlename.value=t.middlename,e.lastname.value=t.lastname,e.username.value=t.username,e.email.value=t.email,e.password.value="",e.avatar.value=t.avatar,e.type.value=t.type,e.status.value=t.status,e.permissions.value=t.permissions,e.credit.value=t.credit,e.office.value=t.office_id,document.querySelectorAll(".error-message").forEach(s=>s.textContent=""),document.querySelectorAll(".form-control").forEach(s=>s.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.userForm.style.display="block",e.userModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.userModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(a){w="view";const t=m.find(s=>s.id==a);t&&(e.modalTitle.textContent="View User Details",e.submitBtn.innerHTML='<i class="fas fa-edit"></i> Edit',e.submitBtn.setAttribute("type","button"),e.submitBtn.onclick=function(){d.to(e.userModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){openEditModal(a)}})},e.firstname.value=t.firstname,e.firstname.setAttribute("readonly",!0),e.middlename.value=t.middlename,e.middlename.setAttribute("readonly",!0),e.lastname.value=t.lastname,e.lastname.setAttribute("readonly",!0),e.username.value=t.username,e.username.setAttribute("readonly",!0),e.email.value=t.email,e.email.setAttribute("readonly",!0),e.password.value="",e.password.setAttribute("readonly",!0),e.avatar.value=t.avatar,e.avatar.setAttribute("readonly",!0),e.type.value=t.type,e.type.setAttribute("readonly",!0),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.permissions.value=t.permissions,e.permissions.setAttribute("disabled",!0),e.credit.value=t.credit,e.credit.setAttribute("readonly",!0),e.createdDateDisplay.textContent=new Date(t.created_at).toLocaleString(),document.querySelectorAll(".error-message").forEach(s=>s.textContent=""),document.querySelectorAll(".form-control").forEach(s=>s.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.userForm.style.display="block",e.userModal.style.display="flex",e.modalOverlay.style.display="block",d.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),d.fromTo(e.userModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),d.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeUserModal=function(){d.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),d.to(e.userModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.userModal.style.display="none",e.userForm.reset(),document.querySelectorAll(".form-control").forEach(a=>{a.removeAttribute("readonly"),a.removeAttribute("disabled")}),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),e.submitBtn.disabled=!1}})};async function k(){if(w==="view")return;const a=e.userForm.action,t=e.formMethod.value,s={firstname:e.firstname.value,middlename:e.middlename.value,lastname:e.lastname.value,username:e.username.value,email:e.email.value,password:e.password.value,avatar:e.avatar.value,type:e.type.value,status:e.status.value,permissions:e.permissions.value,credit:e.credit.value,office_id:e.office.value,_token:p};t==="PUT"&&(s._method="PUT");try{const i=await fetch(a,{method:"POST",headers:{"X-CSRF-TOKEN":p,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}),o=await i.json();if(!i.ok)throw new Error(o.message||"Request failed");g(),v(),closeUserModal(),f.fire({title:"Success!",text:o.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(i){if(console.error("Error:",i),i.message&&i.message.includes("validation")){try{const o=JSON.parse(i.message);o.errors&&Object.keys(o.errors).forEach(r=>{const l=document.getElementById(r+"-error"),c=document.getElementById(r);l&&(l.textContent=o.errors[r][0]),c&&c.classList.add("error")})}catch{}f.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else f.fire({title:"Error!",text:i.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1}}async function S(a){try{if(!(await fetch(window.userRoutes.base+a,{method:"DELETE",headers:{"X-CSRF-TOKEN":p,Accept:"application/json"}})).ok)throw new Error("Delete failed");g(),v(),f.fire({title:"Deleted!",text:"User has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),f.fire({title:"Error!",text:"Error deleting user",icon:"error"})}}
