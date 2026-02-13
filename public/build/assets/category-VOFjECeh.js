import{g as y}from"./index-CB87Sc6I.js";import{S as u}from"./sweetalert2.esm.all-BoFtKDfH.js";var D;const $=(D=document.querySelector('meta[name="csrf-token"]'))==null?void 0:D.getAttribute("content");function w(p="perform this action"){return window.userPermissions===0?(u.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${p}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(c=>{c.isConfirmed&&(window.location.href="/account/setting")}),!1):!0}const B={"X-CSRF-TOKEN":$,"X-Requested-With":"XMLHttpRequest",Accept:"application/json","Content-Type":"application/json"};document.addEventListener("DOMContentLoaded",function(){var S,T,A,M,k;let p=[],c=[],g="cards",h="create";I(),b(),(S=document.getElementById("loadDataBtn"))==null||S.addEventListener("click",function(){b()}),(T=document.getElementById("create_new"))==null||T.addEventListener("click",function(e){if(!w("create new categories")){e.preventDefault(),e.stopPropagation();return}openCreateModal()}),document.querySelectorAll(".toggle-btn").forEach(e=>{e.addEventListener("click",function(){g=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(n=>n.classList.remove("active")),this.classList.add("active");const t=document.getElementById("cardView"),o=document.getElementById("tableView");t&&(t.style.display="none",t.classList.remove("active","cards-view","grid-view","list-view")),o&&(o.style.display="none"),g==="cards"?(t&&(t.classList.add("cards-view","active"),t.style.display="grid"),E(c)):g==="grid"?(t&&(t.classList.add("grid-view","active"),t.style.display="grid"),E(c)):g==="list"?(t&&(t.classList.add("list-view","active"),t.style.display="grid"),E(c)):g==="table"&&(o&&(o.classList.add("active"),o.style.display="block"),C(c))})}),(A=document.getElementById("statusFilter"))==null||A.addEventListener("change",function(){const e=this.value;L(e)}),(M=document.getElementById("resetFilters"))==null||M.addEventListener("click",function(){const e=document.getElementById("statusFilter");e&&(e.value="all"),L("all")}),(k=document.getElementById("categoryForm"))==null||k.addEventListener("submit",function(e){e.preventDefault();const t=document.getElementById("submitBtn");t!=null&&t.disabled||(t&&(t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'),P())});function I(){fetch(window.categoryRoutes.stats,{headers:B}).then(e=>e.json()).then(e=>{const t=document.getElementById("totalCategories"),o=document.getElementById("activeCategories"),n=document.getElementById("inactiveCategories");t&&(t.textContent=e.total||0),o&&(o.textContent=e.active||0),n&&(n.textContent=e.inactive||0)}).catch(e=>console.error("Error loading stats:",e))}function b(){fetch(window.categoryRoutes.data,{headers:B}).then(e=>e.json()).then(e=>{p=e.data||[],c=p,E(c),C(c)}).catch(e=>console.error("Error loading categories:",e))}function L(e){e==="all"?c=p:e==="active"?c=p.filter(i=>i.status==1):e==="inactive"&&(c=p.filter(i=>i.status==0));const t=document.getElementById("cardView"),o=document.getElementById("tableView"),n=document.getElementById("filteredEmptyState");c.length===0&&e!=="all"?(t&&t.classList.add("hidden"),o&&o.classList.add("hidden"),n&&n.classList.remove("hidden")):(t&&t.classList.remove("hidden"),o&&o.classList.remove("hidden"),n&&n.classList.add("hidden"),g==="cards"||g==="grid"||g==="list"?E(c):C(c))}function E(e){const t=document.getElementById("cardView");if(!t)return;if(e.length===0){t.innerHTML=`
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h3>No Categories Found</h3>
                    <p>Get started by adding your first category to the system</p>
                </div>
            `;return}let o="";e.forEach(function(n,i){const s=n.status==1?"active":"inactive",d=n.status==1?"Active":"Inactive",r=n.description||'<span style="color: var(--gray);">No description</span>',l=new Date(n.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});o+=`
                <div class="category-card" data-status="${s}" data-id="${n.id}">
                    <div class="card-header">
                        <div class="category-meta">
                            <span class="category-id">Category #${n.id}</span>
                            <span class="category-date">${l}</span>
                        </div>
                        <div class="status-badge ${s}">
                            ${d}
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="category-name">${n.name}</h5>
                        <div class="category-details">
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${r}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="action-btn-small view view_data" data-id="${n.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions>0?`<button class="action-btn-small edit edit_data" data-id="${n.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>`:""}
                            ${window.userPermissions===1?`<button class="action-btn-small delete delete_data" data-id="${n.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </div>
            `}),t.innerHTML=o,_()}function C(e){var n;const t=document.getElementById("tableBody");if(!t)return;if(e.length===0){t.innerHTML=`
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
            `,(n=document.getElementById("create_new_empty_table"))==null||n.addEventListener("click",function(){openCreateModal()});return}let o="";e.forEach(function(i,s){const d=i.status==1?"active":"inactive",r=i.status==1?"Active":"Inactive",l=i.description||'<span style="color: var(--gray);">No description</span>',a=new Date(i.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});o+=`
                <tr data-status="${d}" data-id="${i.id}">
                    <td class="text-center">${s+1}</td>
                    <td>${a}</td>
                    <td><strong>${i.name}</strong></td>
                    <td>${l}</td>
                    <td class="text-center">
                        <span class="status-badge ${d}">${r}</span>
                    </td>
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
            `}),t.innerHTML=o,O()}function _(){document.querySelectorAll(".view_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(e=>{e.addEventListener("click",function(t){if(!w("edit categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;openEditModal(o)})}),document.querySelectorAll(".delete_data").forEach(e=>{e.addEventListener("click",function(t){if(!w("delete categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;u.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(n=>{n.isConfirmed&&x(o)})})})}function O(){document.querySelectorAll(".action-btn").forEach(e=>{e.addEventListener("click",function(t){t.stopPropagation();const o=this.nextElementSibling;o&&o.classList.toggle("show")})}),document.addEventListener("click",function(e){e.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(e=>{e.addEventListener("click",function(t){if(!w("edit categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;openEditModal(o)})}),document.querySelectorAll(".delete_data").forEach(e=>{e.addEventListener("click",function(t){if(!w("delete categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;u.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(n=>{n.isConfirmed&&x(o)})})})}window.openCreateModal=function(){h="create";const e=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),o=document.getElementById("formMethod"),n=document.getElementById("categoryForm"),i=document.getElementById("viewOnlyGroup");e&&(e.textContent="Create New Category"),t&&(t.innerHTML='<i class="fas fa-save"></i> Save Category',t.disabled=!1),o&&(o.value="POST"),n&&(n.setAttribute("action",window.categoryRoutes.store),n.reset()),document.querySelectorAll(".error-message").forEach(r=>r.textContent=""),document.querySelectorAll(".form-control").forEach(r=>r.classList.remove("error")),i&&(i.style.display="none"),n&&(n.style.display="block");const s=document.getElementById("categoryModal"),d=document.getElementById("modalOverlay");s&&(s.style.display="flex"),d&&(d.style.display="block"),y.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),y.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),y.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openEditModal=function(e){h="edit";const t=p.find(v=>v.id==e);if(!t)return;const o=document.getElementById("modalTitle"),n=document.getElementById("submitBtn"),i=document.getElementById("formMethod"),s=document.getElementById("categoryForm"),d=document.getElementById("viewOnlyGroup");o&&(o.textContent="Edit Category"),n&&(n.innerHTML='<i class="fas fa-save"></i> Update Category',n.disabled=!1),i&&(i.value="PUT"),s&&s.setAttribute("action","/category/"+e);const r=document.getElementById("name"),l=document.getElementById("description"),a=document.getElementById("status");r&&(r.value=t.name),l&&(l.value=t.description||""),a&&(a.value=t.status),document.querySelectorAll(".error-message").forEach(v=>v.textContent=""),document.querySelectorAll(".form-control").forEach(v=>v.classList.remove("error")),d&&(d.style.display="none"),s&&(s.style.display="block");const m=document.getElementById("categoryModal"),f=document.getElementById("modalOverlay");m&&(m.style.display="flex"),f&&(f.style.display="block"),y.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),y.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),y.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openViewModal=function(e){h="view";const t=p.find(f=>f.id==e);if(!t)return;const o=document.getElementById("modalTitle"),n=document.getElementById("submitBtn"),i=document.getElementById("viewOnlyGroup"),s=document.getElementById("createdDateDisplay");o&&(o.textContent="View Category Details"),n&&(n.style.display="none");const d=document.getElementById("name"),r=document.getElementById("description"),l=document.getElementById("status");d&&(d.value=t.name,d.setAttribute("readonly",!0),d.classList.add("view-only-field")),r&&(r.value=t.description||"",r.setAttribute("readonly",!0),r.classList.add("view-only-field")),l&&(l.value=t.status,l.setAttribute("disabled",!0),l.classList.add("view-only-select")),s&&(s.textContent=new Date(t.date_created).toLocaleString()),document.querySelectorAll(".error-message").forEach(f=>f.textContent=""),document.querySelectorAll(".form-control").forEach(f=>f.classList.remove("error")),i&&(i.style.display="block");const a=document.getElementById("categoryModal"),m=document.getElementById("modalOverlay");a&&(a.style.display="flex"),m&&(m.style.display="block"),y.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),y.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),y.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.closeCategoryModal=function(){y.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){const e=document.getElementById("modalOverlay");e&&(e.style.display="none")}}),y.to("#categoryModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){const e=document.getElementById("categoryModal"),t=document.getElementById("categoryForm"),o=document.getElementById("submitBtn");e&&(e.style.display="none"),t&&t.reset(),document.querySelectorAll(".form-control").forEach(n=>{n.removeAttribute("readonly"),n.removeAttribute("disabled"),n.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(n=>n.textContent=""),o&&(o.style.display="inline-block",o.setAttribute("type","submit"),o.onclick=null)}})};function P(){var s,d,r,l;if(h==="view")return;const e=document.getElementById("submitBtn"),t=document.getElementById("categoryForm");if(!t)return;const o=t.getAttribute("action"),n=((s=document.getElementById("formMethod"))==null?void 0:s.value)||"POST",i={name:(d=document.getElementById("name"))==null?void 0:d.value,description:(r=document.getElementById("description"))==null?void 0:r.value,status:(l=document.getElementById("status"))==null?void 0:l.value,_token:$};n==="PUT"&&(i._method="PUT"),fetch(o,{method:"POST",headers:{...B,"Content-Type":"application/json"},body:JSON.stringify(i)}).then(a=>{if(!a.ok){if(a.status===422)return a.json().then(m=>{throw{type:"validation",errors:m.errors}});throw{type:"http",status:a.status,statusText:a.statusText}}return a.json()}).then(a=>{I(),b(),closeCategoryModal(),u.fire({title:"Success!",text:a.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}).catch(a=>{console.error("Error:",a),a.type==="validation"?(Object.keys(a.errors).forEach(m=>{const f=document.getElementById(m+"-error"),v=document.getElementById(m);f&&(f.textContent=a.errors[m][0]),v&&v.classList.add("error")}),u.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})):a.status===419?(u.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):a.status===404?u.fire({title:"Error!",text:"Route not found. Please check your routes configuration.",icon:"error"}):u.fire({title:"Error!",text:a.status+" - "+a.statusText,icon:"error"})}).finally(()=>{e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-save"></i> '+(h==="create"?"Save Category":"Update Category"))})}function x(e){fetch("/category/"+e,{method:"DELETE",headers:B}).then(t=>{if(!t.ok){if(t.status===422)return t.json().then(o=>{throw{type:"business",message:o.message}});throw t.status===419?{type:"session"}:{type:"http",status:t.status,statusText:t.statusText}}return t.json()}).then(()=>{I(),b(),u.fire({title:"Deleted!",text:"Category has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}).catch(t=>{console.error("Error:",t),t.type==="business"?u.fire({title:"Error!",text:t.message,icon:"error"}):t.type==="session"?(u.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):u.fire({title:"Error!",text:"Error deleting category: "+t.status+" - "+t.statusText,icon:"error"})})}});
