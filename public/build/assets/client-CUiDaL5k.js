var T;const x=((T=document.querySelector('meta[name="csrf-token"]'))==null?void 0:T.getAttribute("content"))||"";let b=[],y=[],w="cards",E="create";function I(n="perform this action"){return window.userPermissions===0?(Swal.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${n}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(e=>{e.isConfirmed&&(window.location.href="/account/setting")}),!1):!0}document.addEventListener("DOMContentLoaded",function(){L(),S(),D()});function D(){const n=document.getElementById("loadDataBtn");n&&n.addEventListener("click",S);const e=document.getElementById("create_new");e&&e.addEventListener("click",function(l){if(!I("create new clients")){l.preventDefault(),l.stopPropagation();return}openCreateModal()});const i=document.querySelectorAll(".toggle-btn");i.forEach(l=>{l.addEventListener("click",function(){w=this.dataset.view,i.forEach(r=>r.classList.remove("active")),this.classList.add("active");const s=document.getElementById("cardView"),d=document.getElementById("tableView");s&&(s.style.display="none",s.classList.remove("active","cards-view","grid-view","list-view")),d&&(d.style.display="none"),w==="cards"?s&&(s.classList.add("cards-view","active"),s.style.display="grid",h(y)):w==="grid"?s&&(s.classList.add("grid-view","active"),s.style.display="grid",h(y)):w==="list"?s&&(s.classList.add("list-view","active"),s.style.display="flex",h(y)):w==="table"&&d&&(d.classList.add("active"),d.style.display="block",A(y))})});const t=document.getElementById("statusFilter");t&&t.addEventListener("change",function(){k(this.value)});const a=document.getElementById("resetFilters");a&&a.addEventListener("click",function(){const l=document.getElementById("statusFilter");l&&(l.value="all"),k("all")});const o=document.getElementById("clientForm");o&&o.addEventListener("submit",function(l){l.preventDefault();const s=document.getElementById("submitBtn");s&&s.disabled||(s&&(s.disabled=!0,s.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'),M())})}async function L(){try{const n=await fetch(window.routes.clientsStats,{headers:{"X-CSRF-TOKEN":x,Accept:"application/json"}});if(!n.ok)throw new Error("Failed to load stats");const e=await n.json(),i=document.getElementById("totalClients"),t=document.getElementById("activeClients"),a=document.getElementById("inactiveClients");i&&(i.textContent=e.total||0),t&&(t.textContent=e.active||0),a&&(a.textContent=e.inactive||0)}catch(n){console.error("Error loading stats:",n)}}async function S(){try{const n=await fetch(window.routes.clientsData,{headers:{"X-CSRF-TOKEN":x,Accept:"application/json"}});if(!n.ok)throw new Error("Failed to load clients");b=(await n.json()).data||[],y=b,h(y),A(y)}catch(n){console.error("Error loading clients:",n)}}function k(n){n==="all"?y=b:n==="active"?y=b.filter(a=>a.status==1):n==="inactive"&&(y=b.filter(a=>a.status==0));const e=document.getElementById("cardView"),i=document.getElementById("tableView"),t=document.getElementById("filteredEmptyState");y.length===0&&n!=="all"?(e&&e.classList.add("hidden"),i&&i.classList.add("hidden"),t&&t.classList.remove("hidden")):(e&&(e.classList.remove("hidden"),e.style.display=w==="table"?"none":w==="list"?"flex":"grid"),i&&(i.classList.remove("hidden"),i.style.display=w==="table"?"block":"none"),t&&t.classList.add("hidden"),w==="cards"||w==="grid"||w==="list"?h(y):A(y))}function h(n){const e=document.getElementById("cardView");if(!e)return;if(n.length===0){e.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Clients Found</h3>
                <p>Get started by adding your first client to the system</p>
            </div>
        `;return}let i="";n.forEach(function(t,a){const o=t.status==1?"active":"inactive",l=t.status==1?"Active":"Inactive",s=t.email||'<span style="color: var(--gray);">No email</span>',d=(t.lastname+", "+t.firstname+" "+t.middlename).toUpperCase(),r=new Date(t.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),f=window.userId===1&&window.userOfficeId===0,u=t.office?t.office.office_name:"N/A",m=f?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${u}</span>
            </div>
        `:"",p=window.userPermissions>0,g=window.userPermissions===1;i+=`
            <div class="client-card" data-status="${o}" data-office="${u}" data-id="${t.id}">
                <div class="card-header">
                    <div class="user-meta">
                        <span class="user-id">Client #${t.id}</span>
                        <span class="user-date">${r}</span>
                    </div>
                    <div class="status-badge ${o}">
                        ${l}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="user-name">${d}</h5>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${s}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">${t.address}</span>
                        </div>
                        ${m}
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${t.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        ${p?`<button class="action-btn-small edit edit_data" data-id="${t.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>`:""}
                        ${g?`<button class="action-btn-small delete delete_data" data-id="${t.id}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>`:""}
                    </div>
                </div>
            </div>
        `}),e.innerHTML=i,O()}function A(n){const e=document.getElementById("tableBody");if(!e)return;if(n.length===0){const a=window.userId===1&&window.userOfficeId===0?8:7;e.innerHTML=`
            <tr>
                <td colspan="${a}" class="text-center py-16">
                    <div class="flex flex-col items-center justify-center text-gray-500">
                        <div class="text-6xl mb-4 text-gray-300">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No Clients Found</h3>
                        <p class="text-gray-500 mb-4">Get started by adding your first client to the system</p>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2" id="create_new_empty_table">
                            <i class="fas fa-plus-circle"></i>
                            Add New Client
                        </button>
                    </div>
                </td>
            </tr>
        `;const o=document.getElementById("create_new_empty_table");o&&o.addEventListener("click",openCreateModal);return}let i="";n.forEach(function(t,a){const o=t.status==1?"active":"inactive",l=t.status==1?"Active":"Inactive",s=t.status==1?"bg-green-100 text-green-700":"bg-red-100 text-red-700",d=t.email||'<span class="text-gray-400">No email</span>',r=(t.lastname+", "+t.firstname+" "+t.middlename).toUpperCase(),f=new Date(t.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),u=window.userId===1&&window.userOfficeId===0,m=t.office?t.office.office_name:"N/A",p=u?`<td class="px-4 py-4 text-sm text-gray-700">${m}</td>`:"",g=window.userPermissions>0,c=window.userPermissions===1;i+=`
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100" data-status="${o}" data-office="${m}" data-id="${t.id}">
                <td class="px-4 py-4 text-center text-sm text-gray-600">${a+1}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${f}</td>
                <td class="px-4 py-4 text-sm font-semibold text-gray-800">${r}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${d}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${t.address}</td>
                ${p}
                <td class="px-4 py-4 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${s}">${l}</span>
                </td>
                <td class="px-4 py-4">
                    <div class="relative action-dropdown">
                        <button class="action-btn px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <i class="fas fa-ellipsis-v"></i>
                            Actions
                        </button>
                        <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <a class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2 view_data" data-id="${t.id}">
                                <i class="fas fa-eye text-blue-500"></i>
                                View
                            </a>
                            ${g?`<div class="border-t border-gray-100 my-1"></div>
                            <button class="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2 edit_data" data-id="${t.id}">
                                <i class="fas fa-edit text-green-500"></i>
                                Edit
                            </button>`:""}
                            ${c?`<div class="border-t border-gray-100 my-1"></div>
                            <button class="dropdown-item w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 delete_data" data-id="${t.id}">
                                <i class="fas fa-trash text-red-500"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </td>
            </tr>
        `}),e.innerHTML=i,$()}function O(){document.querySelectorAll(".view_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openViewModal(e)})}),document.querySelectorAll(".edit_data").forEach(n=>{n.addEventListener("click",function(e){if(!I("edit clients")){e.preventDefault(),e.stopPropagation();return}const i=this.dataset.id;openEditModal(i)})}),document.querySelectorAll(".delete_data").forEach(n=>{n.addEventListener("click",function(e){if(!I("delete clients")){e.preventDefault(),e.stopPropagation();return}const i=this.dataset.id;typeof Swal<"u"?Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(t=>{t.isConfirmed&&C(i)}):confirm("Are you sure you want to delete this client?")&&C(i)})})}function $(){document.querySelectorAll(".action-btn").forEach(n=>{n.addEventListener("click",function(e){e.stopPropagation();const i=this.nextElementSibling;i&&i.classList.toggle("hidden")})}),document.addEventListener("click",function(n){n.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(e=>{e.classList.add("hidden")})}),document.querySelectorAll(".view_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openViewModal(e)})}),document.querySelectorAll(".edit_data").forEach(n=>{n.addEventListener("click",function(e){if(!I("edit clients")){e.preventDefault(),e.stopPropagation();return}const i=this.dataset.id;openEditModal(i)})}),document.querySelectorAll(".delete_data").forEach(n=>{n.addEventListener("click",function(e){if(!I("delete clients")){e.preventDefault(),e.stopPropagation();return}const i=this.dataset.id;typeof Swal<"u"?Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(t=>{t.isConfirmed&&C(i)}):confirm("Are you sure you want to delete this client?")&&C(i)})})}window.openCreateModal=function(){E="create";const n=document.getElementById("modalTitle"),e=document.getElementById("submitBtn"),i=document.getElementById("formMethod"),t=document.getElementById("clientForm"),a=document.getElementById("viewOnlyGroup"),o=document.getElementById("officeSelectGroup");n&&(n.textContent="Create New Client"),e&&(e.innerHTML='<i class="fas fa-save"></i> Save Client',e.disabled=!1),i&&(i.value="POST"),t&&(t.setAttribute("action",window.routes.clientsStore),t.reset()),document.querySelectorAll(".error-message").forEach(r=>r.textContent=""),document.querySelectorAll(".form-control").forEach(r=>r.classList.remove("error")),a&&(a.style.display="none"),t&&(t.style.display="block"),window.userId===1&&window.userOfficeId===0&&o&&(o.style.display="block");const s=document.getElementById("clientModal"),d=document.getElementById("modalOverlay");s&&(s.style.display="flex"),d&&(d.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openEditModal=function(n){E="edit";const e=b.find(B=>B.id==n);if(!e)return;const i=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),a=document.getElementById("formMethod"),o=document.getElementById("clientForm"),l=document.getElementById("viewOnlyGroup"),s=document.getElementById("officeSelectGroup");i&&(i.textContent="Edit Client"),t&&(t.innerHTML='<i class="fas fa-save"></i> Update Client',t.disabled=!1),a&&(a.value="PUT"),o&&o.setAttribute("action","/clients/"+n);const d=document.getElementById("firstname"),r=document.getElementById("middlename"),f=document.getElementById("lastname"),u=document.getElementById("email"),m=document.getElementById("address"),p=document.getElementById("walkin_list"),g=document.getElementById("status");d&&(d.value=e.firstname||""),r&&(r.value=e.middlename||""),f&&(f.value=e.lastname||""),u&&(u.value=e.email||""),m&&(m.value=e.address||""),p&&(p.value=e.markup||""),g&&(g.value=e.status||""),document.querySelectorAll(".error-message").forEach(B=>B.textContent=""),document.querySelectorAll(".form-control").forEach(B=>B.classList.remove("error")),l&&(l.style.display="none"),o&&(o.style.display="block"),s&&(s.style.display="none");const c=document.getElementById("clientModal"),v=document.getElementById("modalOverlay");c&&(c.style.display="flex"),v&&(v.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(n){E="view";const e=b.find(v=>v.id==n);if(!e)return;const i=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),a=document.getElementById("viewOnlyGroup"),o=document.getElementById("createdDateDisplay");i&&(i.textContent="View Client Details"),t&&(t.style.display="none");const l=document.getElementById("firstname"),s=document.getElementById("middlename"),d=document.getElementById("lastname"),r=document.getElementById("email"),f=document.getElementById("address"),u=document.getElementById("walkin_list"),m=document.getElementById("status");l&&(l.value=e.firstname||"",l.setAttribute("readonly",!0),l.classList.add("view-only-field")),s&&(s.value=e.middlename||"",s.setAttribute("readonly",!0),s.classList.add("view-only-field")),d&&(d.value=e.lastname||"",d.setAttribute("readonly",!0),d.classList.add("view-only-field")),r&&(r.value=e.email||"",r.setAttribute("readonly",!0),r.classList.add("view-only-field")),f&&(f.value=e.address||"",f.setAttribute("readonly",!0),f.classList.add("view-only-field")),u&&(u.value=e.markup||"",u.setAttribute("disabled",!0),u.classList.add("view-only-select")),m&&(m.value=e.status||"",m.setAttribute("disabled",!0),m.classList.add("view-only-select")),o&&(o.textContent=new Date(e.date_created).toLocaleString()),document.querySelectorAll(".error-message").forEach(v=>v.textContent=""),document.querySelectorAll(".form-control").forEach(v=>v.classList.remove("error")),a&&(a.style.display="block");const p=document.getElementById("clientModal"),g=document.getElementById("modalOverlay"),c=document.getElementById("clientForm");p&&(p.style.display="flex"),g&&(g.style.display="block"),c&&(c.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeClientModal=function(){const n=document.getElementById("clientModal"),e=document.getElementById("modalOverlay"),i=document.getElementById("clientForm"),t=document.getElementById("submitBtn"),a=function(){n&&(n.style.display="none"),e&&(e.style.display="none"),i&&(i.reset(),document.querySelectorAll(".form-control").forEach(o=>{o.removeAttribute("readonly"),o.removeAttribute("disabled"),o.classList.remove("view-only-field","view-only-select"),o.style.backgroundColor="",o.style.color=""}),document.querySelectorAll(".error-message").forEach(o=>o.textContent="")),t&&(t.style.display="inline-block",t.setAttribute("type","submit"),t.onclick=null,t.disabled=!1)};typeof gsap<"u"?(gsap.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){e&&(e.style.display="none")}}),gsap.to("#clientModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:a})):a()};async function M(){var l,s,d,r,f,u,m,p,g;if(E==="view")return;const n=document.getElementById("submitBtn"),e=document.getElementById("clientForm");if(!e)return;const i=e.getAttribute("action"),t=((l=document.getElementById("formMethod"))==null?void 0:l.value)||"POST",a={firstname:((s=document.getElementById("firstname"))==null?void 0:s.value)||"",middlename:((d=document.getElementById("middlename"))==null?void 0:d.value)||"",lastname:((r=document.getElementById("lastname"))==null?void 0:r.value)||"",email:((f=document.getElementById("email"))==null?void 0:f.value)||"",address:((u=document.getElementById("address"))==null?void 0:u.value)||"",walkin_list:((m=document.getElementById("walkin_list"))==null?void 0:m.value)||"",status:((p=document.getElementById("status"))==null?void 0:p.value)||"",_token:x};if(window.userId===1&&window.userOfficeId===0&&E==="create"){const c=(g=document.getElementById("office_id"))==null?void 0:g.value;c&&(a.office_id=c)}t==="PUT"&&(a._method="PUT");try{const c=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":x,Accept:"application/json"},body:JSON.stringify(a)}),v=await c.json();if(c.ok)L(),S(),closeClientModal(),typeof Swal<"u"?Swal.fire({title:"Success!",text:v.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1}):alert(v.message||"Operation successful");else throw new Error(v.message||"Request failed")}catch(c){console.error("Error:",c),typeof Swal<"u"?Swal.fire({title:"Error!",text:c.message||"An error occurred",icon:"error"}):alert("Error: "+(c.message||"An error occurred"))}finally{n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-save"></i> '+(E==="create"?"Save Client":"Update Client"))}}async function C(n){try{if((await fetch("/clients/"+n,{method:"DELETE",headers:{"X-CSRF-TOKEN":x,Accept:"application/json"}})).ok)L(),S(),typeof Swal<"u"?Swal.fire({title:"Deleted!",text:"Client has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1}):alert("Client has been deleted successfully.");else throw new Error("Failed to delete client")}catch(e){console.error("Error deleting client:",e),typeof Swal<"u"?Swal.fire({title:"Error!",text:"Error deleting client",icon:"error"}):alert("Error deleting client")}}window.loadStats=L;window.loadClients=S;window.applyFilter=k;window.renderCards=h;window.renderTable=A;window.deleteClient=C;window.submitClientForm=M;
