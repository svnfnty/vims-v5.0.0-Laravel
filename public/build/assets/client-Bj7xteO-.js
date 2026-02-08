var k;const B=((k=document.querySelector('meta[name="csrf-token"]'))==null?void 0:k.getAttribute("content"))||"";let w=[],y=[],v="cards",b="create";document.addEventListener("DOMContentLoaded",function(){S(),C(),T()});function T(){const n=document.getElementById("loadDataBtn");n&&n.addEventListener("click",C);const e=document.getElementById("create_new");e&&e.addEventListener("click",openCreateModal);const a=document.querySelectorAll(".toggle-btn");a.forEach(l=>{l.addEventListener("click",function(){v=this.dataset.view,a.forEach(r=>r.classList.remove("active")),this.classList.add("active");const s=document.getElementById("cardView"),d=document.getElementById("tableView");s&&(s.style.display="none",s.classList.remove("active","cards-view","grid-view","list-view")),d&&(d.style.display="none"),v==="cards"?s&&(s.classList.add("cards-view","active"),s.style.display="grid",h(y)):v==="grid"?s&&(s.classList.add("grid-view","active"),s.style.display="grid",h(y)):v==="list"?s&&(s.classList.add("list-view","active"),s.style.display="flex",h(y)):v==="table"&&d&&(d.classList.add("active"),d.style.display="block",A(y))})});const t=document.getElementById("statusFilter");t&&t.addEventListener("change",function(){L(this.value)});const i=document.getElementById("resetFilters");i&&i.addEventListener("click",function(){const l=document.getElementById("statusFilter");l&&(l.value="all"),L("all")});const o=document.getElementById("clientForm");o&&o.addEventListener("submit",function(l){l.preventDefault();const s=document.getElementById("submitBtn");s&&s.disabled||(s&&(s.disabled=!0,s.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'),M())})}async function S(){try{const n=await fetch(window.routes.clientsStats,{headers:{"X-CSRF-TOKEN":B,Accept:"application/json"}});if(!n.ok)throw new Error("Failed to load stats");const e=await n.json(),a=document.getElementById("totalClients"),t=document.getElementById("activeClients"),i=document.getElementById("inactiveClients");a&&(a.textContent=e.total||0),t&&(t.textContent=e.active||0),i&&(i.textContent=e.inactive||0)}catch(n){console.error("Error loading stats:",n)}}async function C(){try{const n=await fetch(window.routes.clientsData,{headers:{"X-CSRF-TOKEN":B,Accept:"application/json"}});if(!n.ok)throw new Error("Failed to load clients");w=(await n.json()).data||[],y=w,h(y),A(y)}catch(n){console.error("Error loading clients:",n)}}function L(n){n==="all"?y=w:n==="active"?y=w.filter(i=>i.status==1):n==="inactive"&&(y=w.filter(i=>i.status==0));const e=document.getElementById("cardView"),a=document.getElementById("tableView"),t=document.getElementById("filteredEmptyState");y.length===0&&n!=="all"?(e&&e.classList.add("hidden"),a&&a.classList.add("hidden"),t&&t.classList.remove("hidden")):(e&&(e.classList.remove("hidden"),e.style.display=v==="table"?"none":v==="list"?"flex":"grid"),a&&(a.classList.remove("hidden"),a.style.display=v==="table"?"block":"none"),t&&t.classList.add("hidden"),v==="cards"||v==="grid"||v==="list"?h(y):A(y))}function h(n){const e=document.getElementById("cardView");if(!e)return;if(n.length===0){e.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Clients Found</h3>
                <p>Get started by adding your first client to the system</p>
            </div>
        `;return}let a="";n.forEach(function(t,i){const o=t.status==1?"active":"inactive",l=t.status==1?"Active":"Inactive",s=t.email||'<span style="color: var(--gray);">No email</span>',d=(t.lastname+", "+t.firstname+" "+t.middlename).toUpperCase(),r=new Date(t.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),m=window.userId===1&&window.userOfficeId===0,u=t.office?t.office.office_name:"N/A",f=m?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${u}</span>
            </div>
        `:"",p=window.userPermissions>0,g=window.userPermissions===1;a+=`
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
                        ${f}
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button disabled class="action-btn-small view view_data" data-id="${t.id}">
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
        `}),e.innerHTML=a,O()}function A(n){const e=document.getElementById("tableBody");if(!e)return;if(n.length===0){const i=window.userId===1&&window.userOfficeId===0?8:7;e.innerHTML=`
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
        `;const o=document.getElementById("create_new_empty_table");o&&o.addEventListener("click",openCreateModal);return}let a="";n.forEach(function(t,i){const o=t.status==1?"active":"inactive",l=t.status==1?"Active":"Inactive",s=t.status==1?"bg-green-100 text-green-700":"bg-red-100 text-red-700",d=t.email||'<span class="text-gray-400">No email</span>',r=(t.lastname+", "+t.firstname+" "+t.middlename).toUpperCase(),m=new Date(t.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),u=window.userId===1&&window.userOfficeId===0,f=t.office?t.office.office_name:"N/A",p=u?`<td class="px-4 py-4 text-sm text-gray-700">${f}</td>`:"",g=window.userPermissions>0,c=window.userPermissions===1;a+=`
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100" data-status="${o}" data-office="${f}" data-id="${t.id}">
                <td class="px-4 py-4 text-center text-sm text-gray-600">${i+1}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${m}</td>
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
        `}),e.innerHTML=a,$()}function O(){document.querySelectorAll(".view_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openViewModal(e)})}),document.querySelectorAll(".edit_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openEditModal(e)})}),document.querySelectorAll(".delete_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;typeof Swal<"u"?Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(a=>{a.isConfirmed&&I(e)}):confirm("Are you sure you want to delete this client?")&&I(e)})})}function $(){document.querySelectorAll(".action-btn").forEach(n=>{n.addEventListener("click",function(e){e.stopPropagation();const a=this.nextElementSibling;a&&a.classList.toggle("hidden")})}),document.addEventListener("click",function(n){n.target.closest(".action-dropdown")||document.querySelectorAll(".dropdown-menu").forEach(e=>{e.classList.add("hidden")})}),document.querySelectorAll(".view_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openViewModal(e)})}),document.querySelectorAll(".edit_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;openEditModal(e)})}),document.querySelectorAll(".delete_data").forEach(n=>{n.addEventListener("click",function(){const e=this.dataset.id;typeof Swal<"u"?Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(a=>{a.isConfirmed&&I(e)}):confirm("Are you sure you want to delete this client?")&&I(e)})})}window.openCreateModal=function(){b="create";const n=document.getElementById("modalTitle"),e=document.getElementById("submitBtn"),a=document.getElementById("formMethod"),t=document.getElementById("clientForm"),i=document.getElementById("viewOnlyGroup"),o=document.getElementById("officeSelectGroup");n&&(n.textContent="Create New Client"),e&&(e.innerHTML='<i class="fas fa-save"></i> Save Client',e.disabled=!1),a&&(a.value="POST"),t&&(t.setAttribute("action",window.routes.clientsStore),t.reset()),document.querySelectorAll(".error-message").forEach(r=>r.textContent=""),document.querySelectorAll(".form-control").forEach(r=>r.classList.remove("error")),i&&(i.style.display="none"),t&&(t.style.display="block"),window.userId===1&&window.userOfficeId===0&&o&&(o.style.display="block");const s=document.getElementById("clientModal"),d=document.getElementById("modalOverlay");s&&(s.style.display="flex"),d&&(d.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openEditModal=function(n){b="edit";const e=w.find(x=>x.id==n);if(!e)return;const a=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),i=document.getElementById("formMethod"),o=document.getElementById("clientForm"),l=document.getElementById("viewOnlyGroup"),s=document.getElementById("officeSelectGroup");a&&(a.textContent="Edit Client"),t&&(t.innerHTML='<i class="fas fa-save"></i> Update Client',t.disabled=!1),i&&(i.value="PUT"),o&&o.setAttribute("action","/clients/"+n);const d=document.getElementById("firstname"),r=document.getElementById("middlename"),m=document.getElementById("lastname"),u=document.getElementById("email"),f=document.getElementById("address"),p=document.getElementById("walkin_list"),g=document.getElementById("status");d&&(d.value=e.firstname||""),r&&(r.value=e.middlename||""),m&&(m.value=e.lastname||""),u&&(u.value=e.email||""),f&&(f.value=e.address||""),p&&(p.value=e.markup||""),g&&(g.value=e.status||""),document.querySelectorAll(".error-message").forEach(x=>x.textContent=""),document.querySelectorAll(".form-control").forEach(x=>x.classList.remove("error")),l&&(l.style.display="none"),o&&(o.style.display="block"),s&&(s.style.display="none");const c=document.getElementById("clientModal"),E=document.getElementById("modalOverlay");c&&(c.style.display="flex"),E&&(E.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(n){b="view";const e=w.find(c=>c.id==n);if(!e)return;const a=document.getElementById("modalTitle"),t=document.getElementById("submitBtn"),i=document.getElementById("viewOnlyGroup"),o=document.getElementById("createdDateDisplay");a&&(a.textContent="View Client Details"),t&&(t.innerHTML='<i class="fas fa-edit"></i> Edit',t.setAttribute("type","button"),t.onclick=function(){typeof gsap<"u"?gsap.to("#clientModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){openEditModal(n)}}):openEditModal(n)});const l=document.getElementById("firstname"),s=document.getElementById("middlename"),d=document.getElementById("lastname"),r=document.getElementById("email"),m=document.getElementById("address"),u=document.getElementById("status");l&&(l.value=e.firstname||"",l.setAttribute("readonly",!0)),s&&(s.value=e.middlename||"",s.setAttribute("readonly",!0)),d&&(d.value=e.lastname||"",d.setAttribute("readonly",!0)),r&&(r.value=e.email||"",r.setAttribute("readonly",!0)),m&&(m.value=e.address||"",m.setAttribute("readonly",!0)),u&&(u.value=e.status||"",u.setAttribute("disabled",!0)),o&&(o.textContent=new Date(e.date_created).toLocaleString()),document.querySelectorAll(".error-message").forEach(c=>c.textContent=""),document.querySelectorAll(".form-control").forEach(c=>c.classList.remove("error")),i&&(i.style.display="block");const f=document.getElementById("clientModal"),p=document.getElementById("modalOverlay"),g=document.getElementById("clientForm");f&&(f.style.display="flex"),p&&(p.style.display="block"),g&&(g.style.display="block"),typeof gsap<"u"&&(gsap.fromTo("#modalOverlay",{opacity:0},{opacity:1,duration:.3}),gsap.fromTo("#clientModal",{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),gsap.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closeClientModal=function(){const n=document.getElementById("clientModal"),e=document.getElementById("modalOverlay"),a=document.getElementById("clientForm"),t=function(){n&&(n.style.display="none"),e&&(e.style.display="none"),a&&(a.reset(),document.querySelectorAll(".form-control").forEach(i=>{i.removeAttribute("readonly"),i.removeAttribute("disabled")}),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""))};typeof gsap<"u"?(gsap.to("#modalOverlay",{opacity:0,duration:.3,onComplete:function(){e&&(e.style.display="none")}}),gsap.to("#clientModal",{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:t})):t()};async function M(){var l,s,d,r,m,u,f,p,g;if(b==="view")return;const n=document.getElementById("submitBtn"),e=document.getElementById("clientForm");if(!e)return;const a=e.getAttribute("action"),t=((l=document.getElementById("formMethod"))==null?void 0:l.value)||"POST",i={firstname:((s=document.getElementById("firstname"))==null?void 0:s.value)||"",middlename:((d=document.getElementById("middlename"))==null?void 0:d.value)||"",lastname:((r=document.getElementById("lastname"))==null?void 0:r.value)||"",email:((m=document.getElementById("email"))==null?void 0:m.value)||"",address:((u=document.getElementById("address"))==null?void 0:u.value)||"",walkin_list:((f=document.getElementById("walkin_list"))==null?void 0:f.value)||"",status:((p=document.getElementById("status"))==null?void 0:p.value)||"",_token:B};if(window.userId===1&&window.userOfficeId===0&&b==="create"){const c=(g=document.getElementById("office_id"))==null?void 0:g.value;c&&(i.office_id=c)}t==="PUT"&&(i._method="PUT");try{const c=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":B,Accept:"application/json"},body:JSON.stringify(i)}),E=await c.json();if(c.ok)S(),C(),closeClientModal(),typeof Swal<"u"?Swal.fire({title:"Success!",text:E.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1}):alert(E.message||"Operation successful");else throw new Error(E.message||"Request failed")}catch(c){console.error("Error:",c),typeof Swal<"u"?Swal.fire({title:"Error!",text:c.message||"An error occurred",icon:"error"}):alert("Error: "+(c.message||"An error occurred"))}finally{n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-save"></i> '+(b==="create"?"Save Client":"Update Client"))}}async function I(n){try{if((await fetch("/clients/"+n,{method:"DELETE",headers:{"X-CSRF-TOKEN":B,Accept:"application/json"}})).ok)S(),C(),typeof Swal<"u"?Swal.fire({title:"Deleted!",text:"Client has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1}):alert("Client has been deleted successfully.");else throw new Error("Failed to delete client")}catch(e){console.error("Error deleting client:",e),typeof Swal<"u"?Swal.fire({title:"Error!",text:"Error deleting client",icon:"error"}):alert("Error deleting client")}}window.loadStats=S;window.loadClients=C;window.applyFilter=L;window.renderCards=h;window.renderTable=A;window.deleteClient=I;window.submitClientForm=M;
