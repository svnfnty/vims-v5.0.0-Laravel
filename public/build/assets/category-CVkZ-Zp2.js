import{g as u}from"./index-CB87Sc6I.js";import{S as y}from"./sweetalert2.esm.all-BoFtKDfH.js";var k;const $=(k=document.querySelector('meta[name="csrf-token"]'))==null?void 0:k.getAttribute("content"),b={"X-CSRF-TOKEN":$,"X-Requested-With":"XMLHttpRequest",Accept:"application/json","Content-Type":"application/json"};document.addEventListener("DOMContentLoaded",function(){var S,x,T,M,A;let v=[],r=[],g="cards",E="create";B(),w(),(S=document.getElementById("loadDataBtn"))==null||S.addEventListener("click",function(){w()}),(x=document.getElementById("create_new"))==null||x.addEventListener("click",function(){openCreateModal()}),document.querySelectorAll(".toggle-btn").forEach(e=>{e.addEventListener("click",function(){g=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(a=>a.classList.remove("active")),this.classList.add("active");const t=document.getElementById("cardView"),o=document.getElementById("tableView");t&&(t.style.display="none",t.classList.remove("active","cards-view","grid-view","list-view")),o&&(o.style.display="none"),g==="cards"?(t&&(t.classList.add("cards-view","active"),t.style.display="grid"),h(r)):g==="grid"?(t&&(t.classList.add("grid-view","active"),t.style.display="grid"),h(r)):g==="list"?(t&&(t.classList.add("list-view","active"),t.style.display="grid"),h(r)):g==="table"&&(o&&(o.classList.add("active"),o.style.display="block"),I(r))})}),(T=document.getElementById("statusFilter"))==null||T.addEventListener("change",function(){const e=this.value;C(e)}),(M=document.getElementById("resetFilters"))==null||M.addEventListener("click",function(){const e=document.getElementById("statusFilter");e&&(e.value="all"),C("all")}),(A=document.getElementById("categoryForm"))==null||A.addEventListener("submit",function(e){e.preventDefault();const t=document.getElementById("submitBtn");t!=null&&t.disabled||(t&&(t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'),O())});function B(){fetch(window.categoryRoutes.stats,{headers:b}).then(e=>e.json()).then(e=>{const t=document.getElementById("totalCategories"),o=document.getElementById("activeCategories"),a=document.getElementById("inactiveCategories");t&&(t.textContent=e.total||0),o&&(o.textContent=e.active||0),a&&(a.textContent=e.inactive||0)}).catch(e=>console.error("Error loading stats:",e))}function w(){fetch(window.categoryRoutes.data,{headers:b}).then(e=>e.json()).then(e=>{v=e.data||[],r=v,h(r),I(r)}).catch(e=>console.error("Error loading categories:",e))}function C(e){e==="all"?r=v:e==="active"?r=v.filter(n=>n.status==1):e==="inactive"&&(r=v.filter(n=>n.status==0));const t=document.getElementById("cardView"),o=document.getElementById("tableView"),a=document.getElementById("filteredEmptyState");r.length===0&&e!=="all"?(t&&t.classList.add("hidden"),o&&o.classList.add("hidden"),a&&a.classList.remove("hidden")):(t&&t.classList.remove("hidden"),o&&o.classList.remove("hidden"),a&&a.classList.add("hidden"),g==="cards"||g==="grid"||g==="list"?h(r):I(r))}function h(e){const t=document.getElementById("cardView");if(!t)return;if(e.length===0){t.innerHTML=`
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h3>No Categories Found</h3>
                    <p>Get started by adding your first category to the system</p>
                </div>
            `;return}let o="";e.forEach(function(a,n){const s=a.status==1?"active":"inactive",d=a.status==1?"Active":"Inactive",c=a.description||'<span style="color: var(--gray);">No description</span>',l=new Date(a.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});o+=`
                <div class="category-card" data-status="${s}" data-id="${a.id}">
                    <div class="card-header">
                        <div class="category-meta">
                            <span class="category-id">Category #${a.id}</span>
                            <span class="category-date">${l}</span>
                        </div>
                        <div class="status-badge ${s}">
                            ${d}
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="category-name">${a.name}</h5>
                        <div class="category-details">
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${c}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="action-btn-small view view_data" data-id="${a.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions>0?`<button class="action-btn-small edit edit_data" data-id="${a.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>`:""}
                            ${window.userPermissions===1?`<button class="action-btn-small delete delete_data" data-id="${a.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </div>
            `}),t.innerHTML=o,_()}function I(e){var a;const t=document.getElementById("tableBody");if(!t)return;if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-tags"></i>
                            </div>
                            <h3>No Categories Found</h3>
                            <p>Get started by adding your first category to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New Category
                            </button>
                        </div>
                    </td>
                </tr>
            `,(a=document.getElementById("create_new_empty_table"))==null||a.addEventListener("click",function(){openCreateModal()});return}let o="";e.forEach(function(n,s){const d=n.status==1?"active":"inactive",c=n.status==1?"Active":"Inactive",l=n.description||'<span style="color: var(--gray);">No description</span>',i=new Date(n.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});o+=`
                <tr data-status="${d}" data-id="${n.id}">
                    <td class="text-center">${s+1}</td>
                    <td>${i}</td>
                    <td><strong>${n.name}</strong></td>
                    <td>${l}</td>
                    <td class="text-center">
                        <span class="status-badge ${d}">${c}</span>
                    </td>
                    <td>
                        <div class="action-dropdown">
                            <button class="action-btn">
                                <i class="fas fa-ellipsis-v"></i>
                                Actions
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item view_data" data-id="${n.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </a>
                                ${window.userPermissions>0?`<div class="dropdown-divider"></div>
                                <button class="dropdown-item edit_data" data-id="${n.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>`:""}
                                ${window.userPermissions===1?`<div class="dropdown-divider"></div>
                                <button class="dropdown-item delete_data" data-id="${n.id}">
                                    <i class="fas fa-trash"></i>
                                    Delete
                                </button>`:""}
                            </div>
                        </div>
                    </td>
                </tr>
            `}),t.innerHTML=o,D()}function _(){document.querySelectorAll(".view_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openEditModal(t)})}),document.querySelectorAll(".delete_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;y.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(o=>{o.isConfirmed&&L(t)})})})}function D(){document.querySelectorAll(".action-btn").forEach(e=>{e.addEventListener("click",function(t){t.stopPropagation();const o=this.nextElementSibling;o&&o.classList.toggle("show")})}),document.addEventListener("click",function(e){e.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openEditModal(t)})}),document.querySelectorAll(".delete_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;y.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(o=>{o.isConfirmed&&L(t)})})})}window.openCreateModal=function(){E="create";const e=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),o=document.getElementById("formMethod"),a=document.getElementById("categoryForm"),n=document.getElementById("viewOnlyGroup");e&&(e.textContent="Create New Category"),t&&(t.innerHTML='<i class="fas fa-save"></i> Save Category',t.disabled=!1),o&&(o.value="POST"),a&&(a.setAttribute("action",window.categoryRoutes.store),a.reset()),document.querySelectorAll(".error-message").forEach(c=>c.textContent=""),document.querySelectorAll(".form-control").forEach(c=>c.classList.remove("error")),n&&(n.style.display="none"),a&&(a.style.display="block");const s=document.getElementById("categoryModal"),d=document.getElementById("modalOverlay");s&&(s.style.display="flex"),d&&(d.style.display="block"),u.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),u.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),u.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openEditModal=function(e){E="edit";const t=v.find(p=>p.id==e);if(!t)return;const o=document.getElementById("modalTitle"),a=document.getElementById("submitBtn"),n=document.getElementById("formMethod"),s=document.getElementById("categoryForm"),d=document.getElementById("viewOnlyGroup");o&&(o.textContent="Edit Category"),a&&(a.innerHTML='<i class="fas fa-save"></i> Update Category',a.disabled=!1),n&&(n.value="PUT"),s&&s.setAttribute("action","/category/"+e);const c=document.getElementById("name"),l=document.getElementById("description"),i=document.getElementById("status");c&&(c.value=t.name),l&&(l.value=t.description||""),i&&(i.value=t.status),document.querySelectorAll(".error-message").forEach(p=>p.textContent=""),document.querySelectorAll(".form-control").forEach(p=>p.classList.remove("error")),d&&(d.style.display="none"),s&&(s.style.display="block");const m=document.getElementById("categoryModal"),f=document.getElementById("modalOverlay");m&&(m.style.display="flex"),f&&(f.style.display="block"),u.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),u.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),u.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openViewModal=function(e){E="view";const t=v.find(f=>f.id==e);if(!t)return;const o=document.getElementById("modalTitle"),a=document.getElementById("submitBtn"),n=document.getElementById("viewOnlyGroup"),s=document.getElementById("createdDateDisplay");o&&(o.textContent="View Category Details"),a&&(a.innerHTML='<i class="fas fa-edit"></i> Edit',a.setAttribute("type","button"),a.onclick=function(){u.to("#categoryModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){openEditModal(e)}})});const d=document.getElementById("name"),c=document.getElementById("description"),l=document.getElementById("status");d&&(d.value=t.name,d.setAttribute("readonly",!0)),c&&(c.value=t.description||"",c.setAttribute("readonly",!0)),l&&(l.value=t.status,l.setAttribute("disabled",!0)),s&&(s.textContent=new Date(t.date_created).toLocaleString()),document.querySelectorAll(".error-message").forEach(f=>f.textContent=""),document.querySelectorAll(".form-control").forEach(f=>f.classList.remove("error")),n&&(n.style.display="block");const i=document.getElementById("categoryModal"),m=document.getElementById("modalOverlay");i&&(i.style.display="flex"),m&&(m.style.display="block"),u.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),u.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),u.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.closeCategoryModal=function(){u.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){const e=document.getElementById("modalOverlay");e&&(e.style.display="none")}}),u.to("#categoryModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){const e=document.getElementById("categoryModal"),t=document.getElementById("categoryForm");e&&(e.style.display="none"),t&&t.reset(),document.querySelectorAll(".form-control").forEach(o=>{o.removeAttribute("readonly"),o.removeAttribute("disabled")}),document.querySelectorAll(".error-message").forEach(o=>o.textContent="")}})};function O(){var s,d,c,l;if(E==="view")return;const e=document.getElementById("submitBtn"),t=document.getElementById("categoryForm");if(!t)return;const o=t.getAttribute("action"),a=((s=document.getElementById("formMethod"))==null?void 0:s.value)||"POST",n={name:(d=document.getElementById("name"))==null?void 0:d.value,description:(c=document.getElementById("description"))==null?void 0:c.value,status:(l=document.getElementById("status"))==null?void 0:l.value,_token:$};a==="PUT"&&(n._method="PUT"),fetch(o,{method:"POST",headers:{...b,"Content-Type":"application/json"},body:JSON.stringify(n)}).then(i=>{if(!i.ok){if(i.status===422)return i.json().then(m=>{throw{type:"validation",errors:m.errors}});throw{type:"http",status:i.status,statusText:i.statusText}}return i.json()}).then(i=>{B(),w(),closeCategoryModal(),y.fire({title:"Success!",text:i.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}).catch(i=>{console.error("Error:",i),i.type==="validation"?(Object.keys(i.errors).forEach(m=>{const f=document.getElementById(m+"-error"),p=document.getElementById(m);f&&(f.textContent=i.errors[m][0]),p&&p.classList.add("error")}),y.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})):i.status===419?(y.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):i.status===404?y.fire({title:"Error!",text:"Route not found. Please check your routes configuration.",icon:"error"}):y.fire({title:"Error!",text:i.status+" - "+i.statusText,icon:"error"})}).finally(()=>{e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-save"></i> '+(E==="create"?"Save Category":"Update Category"))})}function L(e){fetch("/categories/"+e,{method:"DELETE",headers:b}).then(t=>{if(!t.ok)throw t.status===419?{type:"session"}:{type:"http",status:t.status};return t.json()}).then(()=>{B(),w(),y.fire({title:"Deleted!",text:"Category has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}).catch(t=>{console.error("Error:",t),t.type==="session"?(y.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):y.fire({title:"Error!",text:"Error deleting category",icon:"error"})})}});
