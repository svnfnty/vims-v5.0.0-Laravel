import{g as p}from"./index-CB87Sc6I.js";import{S as u}from"./sweetalert2.esm.all-BoFtKDfH.js";var A;const D=(A=document.querySelector('meta[name="csrf-token"]'))==null?void 0:A.getAttribute("content");function E(m="perform this action"){if(window.userPermissions===0)return u.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${m}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(s=>{s.isConfirmed&&(window.location.href="/account/setting")}),!1;if(!window.currentUserSubscription||!window.currentUserSubscription.subscription_type)return u.fire({title:"Subscription Required!",text:`You don't have an active subscription. Please subscribe to ${m}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Subscribe Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(s=>{s.isConfirmed&&(window.location.href="/account/setting")}),!1;if(window.currentUserSubscription.subscription_type==="free_trial"){const s=window.currentUserSubscription.subscription_end_date?new Date(window.currentUserSubscription.subscription_end_date):window.currentUserSubscription.last_payment_date?new Date(new Date(window.currentUserSubscription.last_payment_date).setMonth(new Date(window.currentUserSubscription.last_payment_date).getMonth()+1)):null;if(s&&new Date>s)return u.fire({title:"Free Trial Ended!",text:`Your free trial has ended. Please upgrade your subscription to ${m}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Upgrade Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(g=>{g.isConfirmed&&(window.location.href="/account/setting")}),!1}return!0}const B={"X-CSRF-TOKEN":D,"X-Requested-With":"XMLHttpRequest",Accept:"application/json","Content-Type":"application/json"};document.addEventListener("DOMContentLoaded",function(){var S,T,M,_,k;let m=[],s=[],g="cards",w="create";C(),b(),(S=document.getElementById("loadDataBtn"))==null||S.addEventListener("click",function(){b()}),(T=document.getElementById("create_new"))==null||T.addEventListener("click",function(e){if(!E("create new categories")){e.preventDefault(),e.stopPropagation();return}openCreateModal()}),document.querySelectorAll(".toggle-btn").forEach(e=>{e.addEventListener("click",function(){g=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(n=>n.classList.remove("active")),this.classList.add("active");const t=document.getElementById("cardView"),o=document.getElementById("tableView");t&&(t.style.display="none",t.classList.remove("active","cards-view","grid-view","list-view")),o&&(o.style.display="none"),g==="cards"?(t&&(t.classList.add("cards-view","active"),t.style.display="grid"),h(s)):g==="grid"?(t&&(t.classList.add("grid-view","active"),t.style.display="grid"),h(s)):g==="list"?(t&&(t.classList.add("list-view","active"),t.style.display="grid"),h(s)):g==="table"&&(o&&(o.classList.add("active"),o.style.display="block"),I(s))})}),(M=document.getElementById("statusFilter"))==null||M.addEventListener("change",function(){const e=this.value;L(e)}),(_=document.getElementById("resetFilters"))==null||_.addEventListener("click",function(){const e=document.getElementById("statusFilter");e&&(e.value="all"),L("all")}),(k=document.getElementById("categoryForm"))==null||k.addEventListener("submit",function(e){e.preventDefault();const t=document.getElementById("submitBtn");t!=null&&t.disabled||(t&&(t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'),P())});function C(){fetch(window.categoryRoutes.stats,{headers:B}).then(e=>e.json()).then(e=>{const t=document.getElementById("totalCategories"),o=document.getElementById("activeCategories"),n=document.getElementById("inactiveCategories");t&&(t.textContent=e.total||0),o&&(o.textContent=e.active||0),n&&(n.textContent=e.inactive||0)}).catch(e=>console.error("Error loading stats:",e))}function b(){fetch(window.categoryRoutes.data,{headers:B}).then(e=>e.json()).then(e=>{m=e.data||[],s=m,h(s),I(s)}).catch(e=>console.error("Error loading categories:",e))}function L(e){e==="all"?s=m:e==="active"?s=m.filter(i=>i.status==1):e==="inactive"&&(s=m.filter(i=>i.status==0));const t=document.getElementById("cardView"),o=document.getElementById("tableView"),n=document.getElementById("filteredEmptyState");s.length===0&&e!=="all"?(t&&t.classList.add("hidden"),o&&o.classList.add("hidden"),n&&n.classList.remove("hidden")):(t&&t.classList.remove("hidden"),o&&o.classList.remove("hidden"),n&&n.classList.add("hidden"),g==="cards"||g==="grid"||g==="list"?h(s):I(s))}function h(e){const t=document.getElementById("cardView");if(!t)return;if(e.length===0){t.innerHTML=`
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h3>No Categories Found</h3>
                    <p>Get started by adding your first category to the system</p>
                </div>
            `;return}let o="";e.forEach(function(n,i){const r=n.status==1?"active":"inactive",d=n.status==1?"Active":"Inactive",c=n.description||'<span style="color: var(--gray);">No description</span>',l=new Date(n.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});o+=`
                <div class="category-card" data-status="${r}" data-id="${n.id}">
                    <div class="card-header">
                        <div class="category-meta">
                            <span class="category-id">Category #${n.id}</span>
                            <span class="category-date">${l}</span>
                        </div>
                        <div class="status-badge ${r}">
                            ${d}
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="category-name">${n.name}</h5>
                        <div class="category-details">
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${c}</span>
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
            `}),t.innerHTML=o,$()}function I(e){var n;const t=document.getElementById("tableBody");if(!t)return;if(e.length===0){t.innerHTML=`
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
            `,(n=document.getElementById("create_new_empty_table"))==null||n.addEventListener("click",function(){openCreateModal()});return}let o="";e.forEach(function(i,r){const d=i.status==1?"active":"inactive",c=i.status==1?"Active":"Inactive",l=i.description||'<span style="color: var(--gray);">No description</span>',a=new Date(i.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});o+=`
                <tr data-status="${d}" data-id="${i.id}">
                    <td class="text-center">${r+1}</td>
                    <td>${a}</td>
                    <td><strong>${i.name}</strong></td>
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
            `}),t.innerHTML=o,O()}function $(){document.querySelectorAll(".view_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(e=>{e.addEventListener("click",function(t){if(!E("edit categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;openEditModal(o)})}),document.querySelectorAll(".delete_data").forEach(e=>{e.addEventListener("click",function(t){if(!E("delete categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;u.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(n=>{n.isConfirmed&&x(o)})})})}function O(){document.querySelectorAll(".action-btn").forEach(e=>{e.addEventListener("click",function(t){t.stopPropagation();const o=this.nextElementSibling;o&&o.classList.toggle("show")})}),document.addEventListener("click",function(e){e.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(e=>{e.addEventListener("click",function(t){if(!E("edit categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;openEditModal(o)})}),document.querySelectorAll(".delete_data").forEach(e=>{e.addEventListener("click",function(t){if(!E("delete categories")){t.preventDefault(),t.stopPropagation();return}const o=this.dataset.id;u.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(n=>{n.isConfirmed&&x(o)})})})}window.openCreateModal=function(){w="create";const e=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),o=document.getElementById("formMethod"),n=document.getElementById("categoryForm"),i=document.getElementById("viewOnlyGroup");e&&(e.textContent="Create New Category"),t&&(t.innerHTML='<i class="fas fa-save"></i> Save Category',t.disabled=!1),o&&(o.value="POST"),n&&(n.setAttribute("action",window.categoryRoutes.store),n.reset()),document.querySelectorAll(".error-message").forEach(c=>c.textContent=""),document.querySelectorAll(".form-control").forEach(c=>c.classList.remove("error")),i&&(i.style.display="none"),n&&(n.style.display="block");const r=document.getElementById("categoryModal"),d=document.getElementById("modalOverlay");r&&(r.style.display="flex"),d&&(d.style.display="block"),p.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),p.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),p.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openEditModal=function(e){w="edit";const t=m.find(v=>v.id==e);if(!t)return;const o=document.getElementById("modalTitle"),n=document.getElementById("submitBtn"),i=document.getElementById("formMethod"),r=document.getElementById("categoryForm"),d=document.getElementById("viewOnlyGroup");o&&(o.textContent="Edit Category"),n&&(n.innerHTML='<i class="fas fa-save"></i> Update Category',n.disabled=!1),i&&(i.value="PUT"),r&&r.setAttribute("action","/category/"+e);const c=document.getElementById("name"),l=document.getElementById("description"),a=document.getElementById("status");c&&(c.value=t.name),l&&(l.value=t.description||""),a&&(a.value=t.status),document.querySelectorAll(".error-message").forEach(v=>v.textContent=""),document.querySelectorAll(".form-control").forEach(v=>v.classList.remove("error")),d&&(d.style.display="none"),r&&(r.style.display="block");const f=document.getElementById("categoryModal"),y=document.getElementById("modalOverlay");f&&(f.style.display="flex"),y&&(y.style.display="block"),p.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),p.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),p.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.openViewModal=function(e){w="view";const t=m.find(y=>y.id==e);if(!t)return;const o=document.getElementById("modalTitle"),n=document.getElementById("submitBtn"),i=document.getElementById("viewOnlyGroup"),r=document.getElementById("createdDateDisplay");o&&(o.textContent="View Category Details"),n&&(n.style.display="none");const d=document.getElementById("name"),c=document.getElementById("description"),l=document.getElementById("status");d&&(d.value=t.name,d.setAttribute("readonly",!0),d.classList.add("view-only-field")),c&&(c.value=t.description||"",c.setAttribute("readonly",!0),c.classList.add("view-only-field")),l&&(l.value=t.status,l.setAttribute("disabled",!0),l.classList.add("view-only-select")),r&&(r.textContent=new Date(t.date_created).toLocaleString()),document.querySelectorAll(".error-message").forEach(y=>y.textContent=""),document.querySelectorAll(".form-control").forEach(y=>y.classList.remove("error")),i&&(i.style.display="block");const a=document.getElementById("categoryModal"),f=document.getElementById("modalOverlay");a&&(a.style.display="flex"),f&&(f.style.display="block"),p.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),p.fromTo("#categoryModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),p.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})},window.closeCategoryModal=function(){p.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){const e=document.getElementById("modalOverlay");e&&(e.style.display="none")}}),p.to("#categoryModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){const e=document.getElementById("categoryModal"),t=document.getElementById("categoryForm"),o=document.getElementById("submitBtn");e&&(e.style.display="none"),t&&t.reset(),document.querySelectorAll(".form-control").forEach(n=>{n.removeAttribute("readonly"),n.removeAttribute("disabled"),n.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(n=>n.textContent=""),o&&(o.style.display="inline-block",o.setAttribute("type","submit"),o.onclick=null)}})};function P(){var r,d,c,l;if(w==="view")return;const e=document.getElementById("submitBtn"),t=document.getElementById("categoryForm");if(!t)return;const o=t.getAttribute("action"),n=((r=document.getElementById("formMethod"))==null?void 0:r.value)||"POST",i={name:(d=document.getElementById("name"))==null?void 0:d.value,description:(c=document.getElementById("description"))==null?void 0:c.value,status:(l=document.getElementById("status"))==null?void 0:l.value,_token:D};n==="PUT"&&(i._method="PUT"),fetch(o,{method:"POST",headers:{...B,"Content-Type":"application/json"},body:JSON.stringify(i)}).then(a=>{if(!a.ok){if(a.status===422)return a.json().then(f=>{throw{type:"validation",errors:f.errors}});throw{type:"http",status:a.status,statusText:a.statusText}}return a.json()}).then(a=>{C(),b(),closeCategoryModal(),u.fire({title:"Success!",text:a.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}).catch(a=>{console.error("Error:",a),a.type==="validation"?(Object.keys(a.errors).forEach(f=>{const y=document.getElementById(f+"-error"),v=document.getElementById(f);y&&(y.textContent=a.errors[f][0]),v&&v.classList.add("error")}),u.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})):a.status===419?(u.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):a.status===404?u.fire({title:"Error!",text:"Route not found. Please check your routes configuration.",icon:"error"}):u.fire({title:"Error!",text:a.status+" - "+a.statusText,icon:"error"})}).finally(()=>{e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-save"></i> '+(w==="create"?"Save Category":"Update Category"))})}function x(e){fetch("/category/"+e,{method:"DELETE",headers:B}).then(t=>{if(!t.ok){if(t.status===422)return t.json().then(o=>{throw{type:"business",message:o.message}});throw t.status===419?{type:"session"}:{type:"http",status:t.status,statusText:t.statusText}}return t.json()}).then(()=>{C(),b(),u.fire({title:"Deleted!",text:"Category has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}).catch(t=>{console.error("Error:",t),t.type==="business"?u.fire({title:"Error!",text:t.message,icon:"error"}):t.type==="session"?(u.fire({title:"Error!",text:"Session expired. Please refresh the page and try again.",icon:"error"}),location.reload()):u.fire({title:"Error!",text:"Error deleting category: "+t.status+" - "+t.statusText,icon:"error"})})}});
