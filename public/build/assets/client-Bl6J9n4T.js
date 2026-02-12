var k;const x=((k=document.querySelector('meta[name="csrf-token"]'))==null?void 0:k.getAttribute("content"))||"";let E=[],y=[],w="cards",b="create";document.addEventListener("DOMContentLoaded",function(){S(),C(),M()});function M(){const n=document.getElementById("loadDataBtn");n&&n.addEventListener("click",C);const e=document.getElementById("create_new");e&&e.addEventListener("click",openCreateModal);const s=document.querySelectorAll(".toggle-btn");s.forEach(d=>{d.addEventListener("click",function(){w=this.dataset.view,s.forEach(c=>c.classList.remove("active")),this.classList.add("active");const a=document.getElementById("cardView"),l=document.getElementById("tableView");a&&(a.style.display="none",a.classList.remove("active","cards-view","grid-view","list-view")),l&&(l.style.display="none"),w==="cards"?a&&(a.classList.add("cards-view","active"),a.style.display="grid",h(y)):w==="grid"?a&&(a.classList.add("grid-view","active"),a.style.display="grid",h(y)):w==="list"?a&&(a.classList.add("list-view","active"),a.style.display="flex",h(y)):w==="table"&&l&&(l.classList.add("active"),l.style.display="block",L(y))})});const t=document.getElementById("statusFilter");t&&t.addEventListener("change",function(){A(this.value)});const i=document.getElementById("resetFilters");i&&i.addEventListener("click",function(){const d=document.getElementById("statusFilter");d&&(d.value="all"),A("all")});const o=document.getElementById("clientForm");o&&o.addEventListener("submit",function(d){d.preventDefault();const a=document.getElementById("submitBtn");a&&a.disabled||(a&&(a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'),T())})}async function S(){try{const n=await fetch(window.routes.clientsStats,{headers:{"X-CSRF-TOKEN":x,Accept:"application/json"}});if(!n.ok)throw new Error("Failed to load stats");const e=await n.json(),s=document.getElementById("totalClients"),t=document.getElementById("activeClients"),i=document.getElementById("inactiveClients");s&&(s.textContent=e.total||0),t&&(t.textContent=e.active||0),i&&(i.textContent=e.inactive||0)}catch(n){console.error("Error loading stats:",n)}}async function C(){try{const n=await fetch(window.routes.clientsData,{headers:{"X-CSRF-TOKEN":x,Accept:"application/json"}});if(!n.ok)throw new Error("Failed to load clients");E=(await n.json()).data||[],y=E,h(y),L(y)}catch(n){console.error("Error loading clients:",n)}}function A(n){n==="all"?y=E:n==="active"?y=E.filter(i=>i.status==1):n==="inactive"&&(y=E.filter(i=>i.status==0));const e=document.getElementById("cardView"),s=document.getElementById("tableView"),t=document.getElementById("filteredEmptyState");y.length===0&&n!=="all"?(e&&e.classList.add("hidden"),s&&s.classList.add("hidden"),t&&t.classList.remove("hidden")):(e&&(e.classList.remove("hidden"),e.style.display=w==="table"?"none":w==="list"?"flex":"grid"),s&&(s.classList.remove("hidden"),s.style.display=w==="table"?"block":"none"),t&&t.classList.add("hidden"),w==="cards"||w==="grid"||w==="list"?h(y):L(y))}function h(n){const e=document.getElementById("cardView");if(!e)return;if(n.length===0){e.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Clients Found</h3>
                <p>Get started by adding your first client to the system</p>
            </div>
        `;return}let s="";n.forEach(function(t,i){const o=t.status==1?"active":"inactive",d=t.status==1?"Active":"Inactive",a=t.email||'<span style="color: var(--gray);">No email</span>',l=(t.lastname+", "+t.firstname+" "+t.middlename).toUpperCase(),c=new Date(t.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),f=window.userId===1&&window.userOfficeId===0,u=t.office?t.office.office_name:"N/A",m=f?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${u}</span>
            </div>
        `:"",p=window.userPermissions>0,g=window.userPermissions===1;s+=`
            <div class="client-card" data-status="${o}" data-office="${u}" data-id="${t.id}">
                <div class="card-header">
                    <div class="user-meta">
                        <span class="user-id">Client #${t.id}</span>
                        <span class="user-date">${c}</span>
                    </div>
                    <div class="status-badge ${o}">
                        ${d}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="user-name">${l}</h5>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${a}</span>
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
        `}),e.innerHTML=s,O()}function L(n){const e=document.getElementById("tableBody");if(!e)return;if(n.length===0){const i=window.userId===1&&window.userOfficeId===0?8:7;e.innerHTML=`
            <tr>
                <td colspan="${i}" class="text-center py-16">
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
        `;const o=document.getElementById("create_new_empty_table");o&&o.addEventListener("click",openCreateModal);return}let s="";n.forEach(function(t,i){const o=t.status==1?"active":"inactive",d=t.status==1?"Active":"Inactive",a=t.status==1?"bg-green-100 text-green-700":"bg-red-100 text-red-700",l=t.email||'<span class="text-gray-400">No email</span>',c=(t.lastname+", "+t.firstname+" "+t.middlename).toUpperCase(),f=new Date(t.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),u=window.userId===1&&window.userOfficeId===0,m=t.office?t.office.office_name:"N/A",p=u?`<td class="px-4 py-4 text-sm text-gray-700">${m}</td>`:"",g=window.userPermissions>0,r=window.userPermissions===1;s+=`
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100" data-status="${o}" data-office="${m}" data-id="${t.id}">
                <td class="px-4 py-4 text-center text-sm text-gray-600">${i+1}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${f}</td>
                <td class="px-4 py-4 text-sm font-semibold text-gray-800">${c}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${l}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${t.address}</td>
                ${p}
                <td class="px-4 py-4 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${a}">${d}</span>
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
                            ${r?`<div class="border-t border-gray-100 my-1"></div>
                            <button class="dropdown-item w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 delete_data" data-id="${t.id}">
                                <i class="fas fa-trash text-red-500"></i>
                                Delete
                            </button>`:""}
                        </div>
                    </div>
                </td>
            </tr>
        `}),e.innerHTML=s,$()}function O(){document.querySelectorAll(".view_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openViewModal(e)})}),document.querySelectorAll(".edit_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openEditModal(e)})}),document.querySelectorAll(".delete_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;typeof Swal<"u"?Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(s=>{s.isConfirmed&&I(e)}):confirm("Are you sure you want to delete this client?")&&I(e)})})}function $(){document.querySelectorAll(".action-btn").forEach(n=>{n.addEventListener("click",function(e){e.stopPropagation();const s=this.nextElementSibling;s&&s.classList.toggle("hidden")})}),document.addEventListener("click",function(n){n.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(e=>{e.classList.add("hidden")})}),document.querySelectorAll(".view_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openViewModal(e)})}),document.querySelectorAll(".edit_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openEditModal(e)})}),document.querySelectorAll(".delete_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;typeof Swal<"u"?Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(s=>{s.isConfirmed&&I(e)}):confirm("Are you sure you want to delete this client?")&&I(e)})})}window.openCreateModal=function(){b="create";const n=document.getElementById("modalTitle"),e=document.getElementById("submitBtn"),s=document.getElementById("formMethod"),t=document.getElementById("clientForm"),i=document.getElementById("viewOnlyGroup"),o=document.getElementById("officeSelectGroup");n&&(n.textContent="Create New Client"),e&&(e.innerHTML='<i class="fas fa-save"></i> Save Client',e.disabled=!1),s&&(s.value="POST"),t&&(t.setAttribute("action",window.routes.clientsStore),t.reset()),document.querySelectorAll(".error-message").forEach(c=>c.textContent=""),document.querySelectorAll(".form-control").forEach(c=>c.classList.remove("error")),i&&(i.style.display="none"),t&&(t.style.display="block"),window.userId===1&&window.userOfficeId===0&&o&&(o.style.display="block");const a=document.getElementById("clientModal"),l=document.getElementById("modalOverlay");a&&(a.style.display="flex"),l&&(l.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openEditModal=function(n){b="edit";const e=E.find(B=>B.id==n);if(!e)return;const s=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),i=document.getElementById("formMethod"),o=document.getElementById("clientForm"),d=document.getElementById("viewOnlyGroup"),a=document.getElementById("officeSelectGroup");s&&(s.textContent="Edit Client"),t&&(t.innerHTML='<i class="fas fa-save"></i> Update Client',t.disabled=!1),i&&(i.value="PUT"),o&&o.setAttribute("action","/clients/"+n);const l=document.getElementById("firstname"),c=document.getElementById("middlename"),f=document.getElementById("lastname"),u=document.getElementById("email"),m=document.getElementById("address"),p=document.getElementById("walkin_list"),g=document.getElementById("status");l&&(l.value=e.firstname||""),c&&(c.value=e.middlename||""),f&&(f.value=e.lastname||""),u&&(u.value=e.email||""),m&&(m.value=e.address||""),p&&(p.value=e.markup||""),g&&(g.value=e.status||""),document.querySelectorAll(".error-message").forEach(B=>B.textContent=""),document.querySelectorAll(".form-control").forEach(B=>B.classList.remove("error")),d&&(d.style.display="none"),o&&(o.style.display="block"),a&&(a.style.display="none");const r=document.getElementById("clientModal"),v=document.getElementById("modalOverlay");r&&(r.style.display="flex"),v&&(v.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(n){b="view";const e=E.find(v=>v.id==n);if(!e)return;const s=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),i=document.getElementById("viewOnlyGroup"),o=document.getElementById("createdDateDisplay");s&&(s.textContent="View Client Details"),t&&(t.style.display="none");const d=document.getElementById("firstname"),a=document.getElementById("middlename"),l=document.getElementById("lastname"),c=document.getElementById("email"),f=document.getElementById("address"),u=document.getElementById("walkin_list"),m=document.getElementById("status");d&&(d.value=e.firstname||"",d.setAttribute("readonly",!0),d.classList.add("view-only-field")),a&&(a.value=e.middlename||"",a.setAttribute("readonly",!0),a.classList.add("view-only-field")),l&&(l.value=e.lastname||"",l.setAttribute("readonly",!0),l.classList.add("view-only-field")),c&&(c.value=e.email||"",c.setAttribute("readonly",!0),c.classList.add("view-only-field")),f&&(f.value=e.address||"",f.setAttribute("readonly",!0),f.classList.add("view-only-field")),u&&(u.value=e.markup||"",u.setAttribute("disabled",!0),u.classList.add("view-only-select")),m&&(m.value=e.status||"",m.setAttribute("disabled",!0),m.classList.add("view-only-select")),o&&(o.textContent=new Date(e.date_created).toLocaleString()),document.querySelectorAll(".error-message").forEach(v=>v.textContent=""),document.querySelectorAll(".form-control").forEach(v=>v.classList.remove("error")),i&&(i.style.display="block");const p=document.getElementById("clientModal"),g=document.getElementById("modalOverlay"),r=document.getElementById("clientForm");p&&(p.style.display="flex"),g&&(g.style.display="block"),r&&(r.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeClientModal=function(){const n=document.getElementById("clientModal"),e=document.getElementById("modalOverlay"),s=document.getElementById("clientForm"),t=document.getElementById("submitBtn"),i=function(){n&&(n.style.display="none"),e&&(e.style.display="none"),s&&(s.reset(),document.querySelectorAll(".form-control").forEach(o=>{o.removeAttribute("readonly"),o.removeAttribute("disabled"),o.classList.remove("view-only-field","view-only-select"),o.style.backgroundColor="",o.style.color=""}),document.querySelectorAll(".error-message").forEach(o=>o.textContent="")),t&&(t.style.display="inline-block",t.setAttribute("type","submit"),t.onclick=null,t.disabled=!1)};typeof gsap<"u"?(gsap.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){e&&(e.style.display="none")}}),gsap.to("#clientModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:i})):i()};async function T(){var d,a,l,c,f,u,m,p,g;if(b==="view")return;const n=document.getElementById("submitBtn"),e=document.getElementById("clientForm");if(!e)return;const s=e.getAttribute("action"),t=((d=document.getElementById("formMethod"))==null?void 0:d.value)||"POST",i={firstname:((a=document.getElementById("firstname"))==null?void 0:a.value)||"",middlename:((l=document.getElementById("middlename"))==null?void 0:l.value)||"",lastname:((c=document.getElementById("lastname"))==null?void 0:c.value)||"",email:((f=document.getElementById("email"))==null?void 0:f.value)||"",address:((u=document.getElementById("address"))==null?void 0:u.value)||"",walkin_list:((m=document.getElementById("walkin_list"))==null?void 0:m.value)||"",status:((p=document.getElementById("status"))==null?void 0:p.value)||"",_token:x};if(window.userId===1&&window.userOfficeId===0&&b==="create"){const r=(g=document.getElementById("office_id"))==null?void 0:g.value;r&&(i.office_id=r)}t==="PUT"&&(i._method="PUT");try{const r=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":x,Accept:"application/json"},body:JSON.stringify(i)}),v=await r.json();if(r.ok)S(),C(),closeClientModal(),typeof Swal<"u"?Swal.fire({title:"Success!",text:v.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1}):alert(v.message||"Operation successful");else throw new Error(v.message||"Request failed")}catch(r){console.error("Error:",r),typeof Swal<"u"?Swal.fire({title:"Error!",text:r.message||"An error occurred",icon:"error"}):alert("Error: "+(r.message||"An error occurred"))}finally{n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-save"></i> '+(b==="create"?"Save Client":"Update Client"))}}async function I(n){try{if((await fetch("/clients/"+n,{method:"DELETE",headers:{"X-CSRF-TOKEN":x,Accept:"application/json"}})).ok)S(),C(),typeof Swal<"u"?Swal.fire({title:"Deleted!",text:"Client has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1}):alert("Client has been deleted successfully.");else throw new Error("Failed to delete client")}catch(e){console.error("Error deleting client:",e),typeof Swal<"u"?Swal.fire({title:"Error!",text:"Error deleting client",icon:"error"}):alert("Error deleting client")}}window.loadStats=S;window.loadClients=C;window.applyFilter=A;window.renderCards=h;window.renderTable=L;window.deleteClient=I;window.submitClientForm=T;
