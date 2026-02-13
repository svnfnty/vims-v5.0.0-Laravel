import{g as c}from"./index-CB87Sc6I.js";import{S as m}from"./sweetalert2.esm.all-BoFtKDfH.js";var S;const w=((S=document.querySelector('meta[name="csrf-token"]'))==null?void 0:S.getAttribute("content"))||"";function b(a="perform this action"){return window.userPermissions===0?(m.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${a}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1):!0}let y=[],l=[],u="cards",f="create";const e={totalPolicies:document.getElementById("totalPolicies"),activePolicies:document.getElementById("activePolicies"),inactivePolicies:document.getElementById("inactivePolicies"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),policyModal:document.getElementById("policyModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),policyForm:document.getElementById("policyForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),categoryId:document.getElementById("category_id"),code:document.getElementById("code"),name:document.getElementById("name"),description:document.getElementById("description"),description1:document.getElementById("description1"),description2:document.getElementById("description2"),duration:document.getElementById("duration"),thirdPartyLiability:document.getElementById("third_party_liability"),personalAccident:document.getElementById("personal_accident"),tppd:document.getElementById("tppd"),documentaryStamps:document.getElementById("documentary_stamps"),valueAddedTax:document.getElementById("value_added_tax"),localGovTax:document.getElementById("local_gov_tax"),cost:document.getElementById("cost"),docPath:document.getElementById("doc_path"),status:document.getElementById("status"),officeId:document.getElementById("office_id"),officeSelectGroup:document.getElementById("officeSelectGroup")};document.addEventListener("DOMContentLoaded",function(){var a,t,i,o,s,d;L(),E(),(a=document.getElementById("loadDataBtn"))==null||a.addEventListener("click",E),(t=document.getElementById("create_new"))==null||t.addEventListener("click",function(n){if(!b("create new policies")){n.preventDefault(),n.stopPropagation();return}openCreateModal()}),(i=document.getElementById("resetFilters"))==null||i.addEventListener("click",P),document.querySelectorAll(".toggle-btn").forEach(n=>{n.addEventListener("click",function(){u=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(r=>r.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),u==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",v(l)):u==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",v(l)):u==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",v(l)):u==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",B(l))})}),(o=e.statusFilter)==null||o.addEventListener("change",function(){_(this.value)}),(s=e.policyForm)==null||s.addEventListener("submit",function(n){n.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',$())}),(d=e.modalOverlay)==null||d.addEventListener("click",closePolicyModal),e.policyForm&&e.policyForm.addEventListener("submit",function(){window.dispatchEvent(new CustomEvent("tutorial:actionCompleted",{detail:{step:3,action:"policy_created"}}))})});function P(){e.statusFilter.value="all",_("all")}async function L(){try{const t=await(await fetch(window.policiesRoutes.stats,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json();e.totalPolicies.textContent=t.total,e.activePolicies.textContent=t.active,e.inactivePolicies.textContent=t.inactive}catch(a){console.error("Error loading stats:",a)}}async function E(){try{y=(await(await fetch(window.policiesRoutes.data,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json()).data||[],l=y,v(l),B(l)}catch(a){console.error("Error loading policies:",a)}}function _(a){a==="all"?l=y:a==="active"?l=y.filter(t=>t.status==1):a==="inactive"&&(l=y.filter(t=>t.status==0)),l.length===0&&a!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),u==="cards"||u==="grid"||u==="list"?v(l):B(l))}function v(a){if(a.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-file-contract"></i>
                </div>
                <h3>No Policies Found</h3>
                <p>Get started by adding your first policy to the system</p>
            </div>
        `;return}let t="";a.forEach(function(i,o){const s=i.status==1?"active":"inactive",d=i.status==1?"Active":"Inactive",n=i.category?i.category.name:"N/A",r=i.cost?"₱"+parseFloat(i.cost).toLocaleString():"N/A",p=new Date(i.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),A=window.userId===1&&window.userOfficeId===0,g=i.office?i.office.office_name:"N/A",h=A?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${g}</span>
            </div>
        `:"";t+=`
            <div class="policy-card" data-status="${s}" data-office="${g}" data-id="${i.id}">
                <div class="card-header">
                    <div class="policy-meta">
                        <span class="policy-id">Policy #${i.id}</span>
                        <span class="policy-date">${p}</span>
                    </div>
                    <div class="status-badge ${s}">
                        ${d}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="policy-name">${i.name||"N/A"}</h5>
                    <div class="policy-details">
                        <div class="detail-row">
                            <span class="detail-label">Code:</span>
                            <span class="detail-value">${i.code||"N/A"}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value">${n}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cost:</span>
                            <span class="detail-value">${r}</span>
                        </div>
                        ${h}
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
        `}),e.cardView.innerHTML=t,T()}function B(a){var i;if(a.length===0){const s=window.userId===1&&window.userOfficeId===0?9:8;e.tableBody.innerHTML=`
            <tr>
                <td colspan="${s}">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <h3>No Policies Found</h3>
                        <p>Get started by adding your first policy to the system</p>
                        <button class="control-btn primary" id="create_new_empty_table">
                            <i class="fas fa-plus-circle"></i>
                            Add New Policy
                        </button>
                    </div>
                </td>
            </tr>
        `,(i=document.getElementById("create_new_empty_table"))==null||i.addEventListener("click",openCreateModal);return}let t="";a.forEach(function(o,s){const d=o.status==1?"active":"inactive",n=o.status==1?"Active":"Inactive",r=o.category?o.category.name:"N/A",p=o.cost?"₱"+parseFloat(o.cost).toLocaleString():"N/A",A=new Date(o.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),g=window.userId===1&&window.userOfficeId===0,h=o.office?o.office.office_name:"N/A",x=g?`<td>${h}</td>`:"";t+=`
            <tr data-status="${d}" data-office="${h}" data-id="${o.id}">
                <td class="text-center">${s+1}</td>
                <td>${A}</td>
                <td><strong>${o.code||"N/A"}</strong></td>
                <td>${o.name||"N/A"}</td>
                <td>${r}</td>
                <td>${p}</td>
                ${x}
                <td class="text-center">
                    <span class="status-badge ${d}">${n}</span>
                </td>
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
        `}),e.tableBody.innerHTML=t,C()}function T(){document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("edit policies")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;openEditModal(i)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("delete policies")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;m.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(o=>{o.isConfirmed&&I(i)})})})}function C(){document.querySelectorAll(".action-btn").forEach(a=>{a.addEventListener("click",function(t){t.stopPropagation();const i=this.nextElementSibling;i&&i.classList.toggle("show")})}),document.addEventListener("click",function(a){a.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown .dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(a=>{a.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("edit policies")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;openEditModal(i)})}),document.querySelectorAll(".delete_data").forEach(a=>{a.addEventListener("click",function(t){if(!b("delete policies")){t.preventDefault(),t.stopPropagation();return}const i=this.dataset.id;m.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(o=>{o.isConfirmed&&I(i)})})})}window.openCreateModal=function(){f="create",e.modalTitle.textContent="Create New Policy",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save Policy',e.formMethod.value="POST",e.policyForm.action=window.policiesRoutes.store,e.policyForm.reset(),document.querySelectorAll(".error-message").forEach(t=>t.textContent=""),document.querySelectorAll(".form-control").forEach(t=>t.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.policyForm.style.display="block",window.userId===1&&window.userOfficeId===0&&e.officeSelectGroup&&(e.officeSelectGroup.style.display="block"),e.policyModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.policyModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(a){f="edit";const t=y.find(i=>i.id==a);t&&(e.modalTitle.textContent="Edit Policy",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update Policy',e.formMethod.value="PUT",e.policyForm.action="/policies/"+a,e.categoryId.value=t.category_id,e.code.value=t.code,e.name.value=t.name,e.description.value=t.description,e.description1.value=t.description1,e.description2.value=t.description2,e.duration.value=t.duration,e.thirdPartyLiability.value=t.third_party_liability,e.personalAccident.value=t.personal_accident,e.tppd.value=t.tppd,e.documentaryStamps.value=t.documentary_stamps,e.valueAddedTax.value=t.value_added_tax,e.localGovTax.value=t.local_gov_tax,e.cost.value=t.cost,e.docPath.value=t.doc_path,e.status.value=t.status,document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.policyForm.style.display="block",e.officeSelectGroup&&(e.officeSelectGroup.style.display="none"),e.policyModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.policyModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(a){f="view";const t=y.find(i=>i.id==a);t&&(e.modalTitle.textContent="View Policy Details",e.submitBtn.style.display="none",e.categoryId.value=t.category_id,e.categoryId.setAttribute("disabled",!0),e.categoryId.classList.add("view-only-select"),e.code.value=t.code,e.code.setAttribute("readonly",!0),e.code.classList.add("view-only-field"),e.name.value=t.name,e.name.setAttribute("readonly",!0),e.name.classList.add("view-only-field"),e.description.value=t.description,e.description.setAttribute("readonly",!0),e.description.classList.add("view-only-field"),e.description1.value=t.description1,e.description1.setAttribute("readonly",!0),e.description1.classList.add("view-only-field"),e.description2.value=t.description2,e.description2.setAttribute("readonly",!0),e.description2.classList.add("view-only-field"),e.duration.value=t.duration,e.duration.setAttribute("readonly",!0),e.duration.classList.add("view-only-field"),e.thirdPartyLiability.value=t.third_party_liability,e.thirdPartyLiability.setAttribute("readonly",!0),e.thirdPartyLiability.classList.add("view-only-field"),e.personalAccident.value=t.personal_accident,e.personalAccident.setAttribute("readonly",!0),e.personalAccident.classList.add("view-only-field"),e.tppd.value=t.tppd,e.tppd.setAttribute("readonly",!0),e.tppd.classList.add("view-only-field"),e.documentaryStamps.value=t.documentary_stamps,e.documentaryStamps.setAttribute("readonly",!0),e.documentaryStamps.classList.add("view-only-field"),e.valueAddedTax.value=t.value_added_tax,e.valueAddedTax.setAttribute("readonly",!0),e.valueAddedTax.classList.add("view-only-field"),e.localGovTax.value=t.local_gov_tax,e.localGovTax.setAttribute("readonly",!0),e.localGovTax.classList.add("view-only-field"),e.cost.value=t.cost,e.cost.setAttribute("readonly",!0),e.cost.classList.add("view-only-field"),e.docPath.value=t.doc_path,e.docPath.setAttribute("readonly",!0),e.docPath.classList.add("view-only-field"),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.createdDateDisplay.textContent=new Date(t.date_created).toLocaleString(),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),document.querySelectorAll(".form-control").forEach(i=>i.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.policyForm.style.display="block",e.policyModal.style.display="flex",e.modalOverlay.style.display="block",c.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),c.fromTo(e.policyModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),c.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closePolicyModal=function(){c.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),c.to(e.policyModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.policyModal.style.display="none",e.policyForm.reset(),document.querySelectorAll(".form-control").forEach(a=>{a.removeAttribute("readonly"),a.removeAttribute("disabled"),a.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function $(){if(f==="view")return;const a=e.policyForm.action,t=e.formMethod.value,i={category_id:e.categoryId.value,code:e.code.value,name:e.name.value,description:e.description.value,description1:e.description1.value,description2:e.description2.value,duration:e.duration.value,third_party_liability:e.thirdPartyLiability.value,personal_accident:e.personalAccident.value,tppd:e.tppd.value,documentary_stamps:e.documentaryStamps.value,value_added_tax:e.valueAddedTax.value,local_gov_tax:e.localGovTax.value,cost:e.cost.value,doc_path:e.docPath.value,status:e.status.value,_token:w};if(window.userId===1&&window.userOfficeId===0&&f==="create"&&e.officeId){const s=e.officeId.value;s&&(i.office_id=s)}t==="PUT"&&(i._method="PUT");try{const s=await fetch(a,{method:"POST",headers:{"X-CSRF-TOKEN":w,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(i)}),d=await s.json();if(!s.ok)throw new Error(d.message||"Request failed");L(),E(),closePolicyModal(),m.fire({title:"Success!",text:d.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(s){if(console.error("Error:",s),s.message&&s.message.includes("validation")){try{const d=JSON.parse(s.message);d.errors&&Object.keys(d.errors).forEach(n=>{const r=document.getElementById(n+"-error"),p=document.getElementById(n);r&&(r.textContent=d.errors[n][0]),p&&p.classList.add("error")})}catch{}m.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else m.fire({title:"Error!",text:s.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1,e.submitBtn.innerHTML='<i class="fas fa-save"></i> '+(f==="create"?"Save Policy":"Update Policy")}}async function I(a){try{if(!(await fetch("/policies/"+a,{method:"DELETE",headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).ok)throw new Error("Delete failed");L(),E(),m.fire({title:"Deleted!",text:"Policy has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),m.fire({title:"Error!",text:"Error deleting policy",icon:"error"})}}
