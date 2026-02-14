import{g as l}from"./index-CB87Sc6I.js";import{S as r}from"./sweetalert2.esm.all-BoFtKDfH.js";var A;const w=((A=document.querySelector('meta[name="csrf-token"]'))==null?void 0:A.getAttribute("content"))||"";function b(i="perform this action"){if(window.userPermissions===0)return r.fire({title:"Subscription Required!",text:`Your subscription has expired or you don't have permission to ${i}. Please renew your subscription to continue using this feature.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Renew Subscription",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1;if(!window.currentUserSubscription||!window.currentUserSubscription.subscription_type)return r.fire({title:"Subscription Required!",text:`You don't have an active subscription. Please subscribe to ${i}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Subscribe Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(t=>{t.isConfirmed&&(window.location.href="/account/setting")}),!1;if(window.currentUserSubscription.subscription_type==="free_trial"){const t=window.currentUserSubscription.subscription_end_date?new Date(window.currentUserSubscription.subscription_end_date):window.currentUserSubscription.last_payment_date?new Date(new Date(window.currentUserSubscription.last_payment_date).setMonth(new Date(window.currentUserSubscription.last_payment_date).getMonth()+1)):null;if(t&&new Date>t)return r.fire({title:"Free Trial Ended!",text:`Your free trial has ended. Please upgrade your subscription to ${i}.`,icon:"warning",showCancelButton:!0,confirmButtonText:"Upgrade Now",cancelButtonText:"Cancel",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1}).then(a=>{a.isConfirmed&&(window.location.href="/account/setting")}),!1}return!0}let m=[],c=[],p="cards",f="create";const e={totalPolicies:document.getElementById("totalPolicies"),activePolicies:document.getElementById("activePolicies"),inactivePolicies:document.getElementById("inactivePolicies"),cardView:document.getElementById("cardView"),tableView:document.getElementById("tableView"),tableBody:document.getElementById("tableBody"),filteredEmptyState:document.getElementById("filteredEmptyState"),statusFilter:document.getElementById("statusFilter"),policyModal:document.getElementById("policyModal"),modalOverlay:document.getElementById("modalOverlay"),modalTitle:document.getElementById("modalTitle"),submitBtn:document.getElementById("submitBtn"),policyForm:document.getElementById("policyForm"),formMethod:document.getElementById("formMethod"),viewOnlyGroup:document.getElementById("viewOnlyGroup"),createdDateDisplay:document.getElementById("createdDateDisplay"),categoryId:document.getElementById("category_id"),code:document.getElementById("code"),name:document.getElementById("name"),description:document.getElementById("description"),description1:document.getElementById("description1"),description2:document.getElementById("description2"),duration:document.getElementById("duration"),thirdPartyLiability:document.getElementById("third_party_liability"),personalAccident:document.getElementById("personal_accident"),tppd:document.getElementById("tppd"),documentaryStamps:document.getElementById("documentary_stamps"),valueAddedTax:document.getElementById("value_added_tax"),localGovTax:document.getElementById("local_gov_tax"),cost:document.getElementById("cost"),docPath:document.getElementById("doc_path"),status:document.getElementById("status"),officeId:document.getElementById("office_id"),officeSelectGroup:document.getElementById("officeSelectGroup")};document.addEventListener("DOMContentLoaded",function(){var i,t,a,o,s,n;_(),E(),(i=document.getElementById("loadDataBtn"))==null||i.addEventListener("click",E),(t=document.getElementById("create_new"))==null||t.addEventListener("click",function(d){if(!b("create new policies")){d.preventDefault(),d.stopPropagation();return}openCreateModal()}),(a=document.getElementById("resetFilters"))==null||a.addEventListener("click",C),document.querySelectorAll(".toggle-btn").forEach(d=>{d.addEventListener("click",function(){p=this.dataset.view,document.querySelectorAll(".toggle-btn").forEach(u=>u.classList.remove("active")),this.classList.add("active"),e.cardView.style.display="none",e.tableView.style.display="none",e.cardView.classList.remove("active","cards-view","grid-view","list-view"),p==="cards"?(e.cardView.classList.add("cards-view","active"),e.cardView.style.display="grid",v(c)):p==="grid"?(e.cardView.classList.add("grid-view","active"),e.cardView.style.display="grid",v(c)):p==="list"?(e.cardView.classList.add("list-view","active"),e.cardView.style.display="grid",v(c)):p==="table"&&(e.tableView.classList.add("active"),e.tableView.style.display="block",S(c))})}),(o=e.statusFilter)==null||o.addEventListener("change",function(){L(this.value)}),(s=e.policyForm)==null||s.addEventListener("submit",function(d){d.preventDefault(),!e.submitBtn.disabled&&(e.submitBtn.disabled=!0,e.submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...',D())}),(n=e.modalOverlay)==null||n.addEventListener("click",closePolicyModal),e.policyForm&&e.policyForm.addEventListener("submit",function(){window.dispatchEvent(new CustomEvent("tutorial:actionCompleted",{detail:{step:3,action:"policy_created"}}))})});function C(){e.statusFilter.value="all",L("all")}async function _(){try{const t=await(await fetch(window.policiesRoutes.stats,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json();e.totalPolicies.textContent=t.total,e.activePolicies.textContent=t.active,e.inactivePolicies.textContent=t.inactive}catch(i){console.error("Error loading stats:",i)}}async function E(){try{m=(await(await fetch(window.policiesRoutes.data,{headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).json()).data||[],c=m,v(c),S(c)}catch(i){console.error("Error loading policies:",i)}}function L(i){i==="all"?c=m:i==="active"?c=m.filter(t=>t.status==1):i==="inactive"&&(c=m.filter(t=>t.status==0)),c.length===0&&i!=="all"?(e.cardView.classList.add("hidden"),e.tableView.classList.add("hidden"),e.filteredEmptyState.classList.remove("hidden")):(e.cardView.classList.remove("hidden"),e.tableView.classList.remove("hidden"),e.filteredEmptyState.classList.add("hidden"),p==="cards"||p==="grid"||p==="list"?v(c):S(c))}function v(i){if(i.length===0){e.cardView.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-file-contract"></i>
                </div>
                <h3>No Policies Found</h3>
                <p>Get started by adding your first policy to the system</p>
            </div>
        `;return}let t="";i.forEach(function(a,o){const s=a.status==1?"active":"inactive",n=a.status==1?"Active":"Inactive",d=a.category?a.category.name:"N/A",u=a.cost?"₱"+parseFloat(a.cost).toLocaleString():"N/A",y=new Date(a.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),B=window.userId===1&&window.userOfficeId===0,h=a.office?a.office.office_name:"N/A",g=B?`
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${h}</span>
            </div>
        `:"";t+=`
            <div class="policy-card" data-status="${s}" data-office="${h}" data-id="${a.id}">
                <div class="card-header">
                    <div class="policy-meta">
                        <span class="policy-id">Policy #${a.id}</span>
                        <span class="policy-date">${y}</span>
                    </div>
                    <div class="status-badge ${s}">
                        ${n}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="policy-name">${a.name||"N/A"}</h5>
                    <div class="policy-details">
                        <div class="detail-row">
                            <span class="detail-label">Code:</span>
                            <span class="detail-value">${a.code||"N/A"}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value">${d}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cost:</span>
                            <span class="detail-value">${u}</span>
                        </div>
                        ${g}
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
        `}),e.cardView.innerHTML=t,P()}function S(i){var a;if(i.length===0){const s=window.userId===1&&window.userOfficeId===0?9:8;e.tableBody.innerHTML=`
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
        `,(a=document.getElementById("create_new_empty_table"))==null||a.addEventListener("click",openCreateModal);return}let t="";i.forEach(function(o,s){const n=o.status==1?"active":"inactive",d=o.status==1?"Active":"Inactive",u=o.category?o.category.name:"N/A",y=o.cost?"₱"+parseFloat(o.cost).toLocaleString():"N/A",B=new Date(o.date_created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),h=window.userId===1&&window.userOfficeId===0,g=o.office?o.office.office_name:"N/A",I=h?`<td>${g}</td>`:"";t+=`
            <tr data-status="${n}" data-office="${g}" data-id="${o.id}">
                <td class="text-center">${s+1}</td>
                <td>${B}</td>
                <td><strong>${o.code||"N/A"}</strong></td>
                <td>${o.name||"N/A"}</td>
                <td>${u}</td>
                <td>${y}</td>
                ${I}
                <td class="text-center">
                    <span class="status-badge ${n}">${d}</span>
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
        `}),e.tableBody.innerHTML=t,T()}function P(){document.querySelectorAll(".view_data").forEach(i=>{i.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(i=>{i.addEventListener("click",function(t){if(!b("edit policies")){t.preventDefault(),t.stopPropagation();return}const a=this.dataset.id;openEditModal(a)})}),document.querySelectorAll(".delete_data").forEach(i=>{i.addEventListener("click",function(t){if(!b("delete policies")){t.preventDefault(),t.stopPropagation();return}const a=this.dataset.id;r.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(o=>{o.isConfirmed&&x(a)})})})}function T(){document.querySelectorAll(".action-btn").forEach(i=>{i.addEventListener("click",function(t){t.stopPropagation();const a=this.nextElementSibling;a&&a.classList.toggle("show")})}),document.addEventListener("click",function(i){i.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown .dropdown-menu").forEach(t=>{t.classList.remove("show")})}),document.querySelectorAll(".view_data").forEach(i=>{i.addEventListener("click",function(){const t=this.dataset.id;openViewModal(t)})}),document.querySelectorAll(".edit_data").forEach(i=>{i.addEventListener("click",function(t){if(!b("edit policies")){t.preventDefault(),t.stopPropagation();return}const a=this.dataset.id;openEditModal(a)})}),document.querySelectorAll(".delete_data").forEach(i=>{i.addEventListener("click",function(t){if(!b("delete policies")){t.preventDefault(),t.stopPropagation();return}const a=this.dataset.id;r.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(o=>{o.isConfirmed&&x(a)})})})}window.openCreateModal=function(){f="create",e.modalTitle.textContent="Create New Policy",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Save Policy',e.formMethod.value="POST",e.policyForm.action=window.policiesRoutes.store,e.policyForm.reset(),document.querySelectorAll(".error-message").forEach(t=>t.textContent=""),document.querySelectorAll(".form-control").forEach(t=>t.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.policyForm.style.display="block",window.userId===1&&window.userOfficeId===0&&e.officeSelectGroup&&(e.officeSelectGroup.style.display="block"),e.policyModal.style.display="flex",e.modalOverlay.style.display="block",l.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),l.fromTo(e.policyModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),l.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"})};window.openEditModal=function(i){f="edit";const t=m.find(a=>a.id==i);t&&(e.modalTitle.textContent="Edit Policy",e.submitBtn.innerHTML='<i class="fas fa-save"></i> Update Policy',e.formMethod.value="PUT",e.policyForm.action="/policies/"+i,e.categoryId.value=t.category_id,e.code.value=t.code,e.name.value=t.name,e.description.value=t.description,e.description1.value=t.description1,e.description2.value=t.description2,e.duration.value=t.duration,e.thirdPartyLiability.value=t.third_party_liability,e.personalAccident.value=t.personal_accident,e.tppd.value=t.tppd,e.documentaryStamps.value=t.documentary_stamps,e.valueAddedTax.value=t.value_added_tax,e.localGovTax.value=t.local_gov_tax,e.cost.value=t.cost,e.docPath.value=t.doc_path,e.status.value=t.status,document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),document.querySelectorAll(".form-control").forEach(a=>a.classList.remove("error")),e.viewOnlyGroup.style.display="none",e.policyForm.style.display="block",e.officeSelectGroup&&(e.officeSelectGroup.style.display="none"),e.policyModal.style.display="flex",e.modalOverlay.style.display="block",l.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),l.fromTo(e.policyModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),l.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.openViewModal=function(i){f="view";const t=m.find(a=>a.id==i);t&&(e.modalTitle.textContent="View Policy Details",e.submitBtn.style.display="none",e.categoryId.value=t.category_id,e.categoryId.setAttribute("disabled",!0),e.categoryId.classList.add("view-only-select"),e.code.value=t.code,e.code.setAttribute("readonly",!0),e.code.classList.add("view-only-field"),e.name.value=t.name,e.name.setAttribute("readonly",!0),e.name.classList.add("view-only-field"),e.description.value=t.description,e.description.setAttribute("readonly",!0),e.description.classList.add("view-only-field"),e.description1.value=t.description1,e.description1.setAttribute("readonly",!0),e.description1.classList.add("view-only-field"),e.description2.value=t.description2,e.description2.setAttribute("readonly",!0),e.description2.classList.add("view-only-field"),e.duration.value=t.duration,e.duration.setAttribute("readonly",!0),e.duration.classList.add("view-only-field"),e.thirdPartyLiability.value=t.third_party_liability,e.thirdPartyLiability.setAttribute("readonly",!0),e.thirdPartyLiability.classList.add("view-only-field"),e.personalAccident.value=t.personal_accident,e.personalAccident.setAttribute("readonly",!0),e.personalAccident.classList.add("view-only-field"),e.tppd.value=t.tppd,e.tppd.setAttribute("readonly",!0),e.tppd.classList.add("view-only-field"),e.documentaryStamps.value=t.documentary_stamps,e.documentaryStamps.setAttribute("readonly",!0),e.documentaryStamps.classList.add("view-only-field"),e.valueAddedTax.value=t.value_added_tax,e.valueAddedTax.setAttribute("readonly",!0),e.valueAddedTax.classList.add("view-only-field"),e.localGovTax.value=t.local_gov_tax,e.localGovTax.setAttribute("readonly",!0),e.localGovTax.classList.add("view-only-field"),e.cost.value=t.cost,e.cost.setAttribute("readonly",!0),e.cost.classList.add("view-only-field"),e.docPath.value=t.doc_path,e.docPath.setAttribute("readonly",!0),e.docPath.classList.add("view-only-field"),e.status.value=t.status,e.status.setAttribute("disabled",!0),e.status.classList.add("view-only-select"),e.createdDateDisplay.textContent=new Date(t.date_created).toLocaleString(),document.querySelectorAll(".error-message").forEach(a=>a.textContent=""),document.querySelectorAll(".form-control").forEach(a=>a.classList.remove("error")),e.viewOnlyGroup.style.display="block",e.policyForm.style.display="block",e.policyModal.style.display="flex",e.modalOverlay.style.display="block",l.fromTo(e.modalOverlay,{opacity:0},{opacity:1,duration:.3}),l.fromTo(e.policyModal,{opacity:0,scale:.9,y:-50},{opacity:1,scale:1,y:0,duration:.4,ease:"back.out"}),l.fromTo(".form-group",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,stagger:.05,ease:"power2.out"}))};window.closePolicyModal=function(){l.to(e.modalOverlay,{opacity:0,duration:.3,onComplete:function(){e.modalOverlay.style.display="none"}}),l.to(e.policyModal,{opacity:0,scale:.9,y:-50,duration:.3,ease:"back.in",onComplete:function(){e.policyModal.style.display="none",e.policyForm.reset(),document.querySelectorAll(".form-control").forEach(i=>{i.removeAttribute("readonly"),i.removeAttribute("disabled"),i.classList.remove("view-only-field","view-only-select")}),document.querySelectorAll(".error-message").forEach(i=>i.textContent=""),e.submitBtn.style.display="inline-block",e.submitBtn.setAttribute("type","submit"),e.submitBtn.onclick=null,e.submitBtn.disabled=!1}})};async function D(){if(f==="view")return;const i=e.policyForm.action,t=e.formMethod.value,a={category_id:e.categoryId.value,code:e.code.value,name:e.name.value,description:e.description.value,description1:e.description1.value,description2:e.description2.value,duration:e.duration.value,third_party_liability:e.thirdPartyLiability.value,personal_accident:e.personalAccident.value,tppd:e.tppd.value,documentary_stamps:e.documentaryStamps.value,value_added_tax:e.valueAddedTax.value,local_gov_tax:e.localGovTax.value,cost:e.cost.value,doc_path:e.docPath.value,status:e.status.value,_token:w};if(window.userId===1&&window.userOfficeId===0&&f==="create"&&e.officeId){const s=e.officeId.value;s&&(a.office_id=s)}t==="PUT"&&(a._method="PUT");try{const s=await fetch(i,{method:"POST",headers:{"X-CSRF-TOKEN":w,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(a)}),n=await s.json();if(!s.ok)throw new Error(n.message||"Request failed");_(),E(),closePolicyModal(),r.fire({title:"Success!",text:n.message||"Operation successful",icon:"success",timer:2e3,showConfirmButton:!1})}catch(s){if(console.error("Error:",s),s.message&&s.message.includes("validation")){try{const n=JSON.parse(s.message);n.errors&&Object.keys(n.errors).forEach(d=>{const u=document.getElementById(d+"-error"),y=document.getElementById(d);u&&(u.textContent=n.errors[d][0]),y&&y.classList.add("error")})}catch{}r.fire({title:"Validation Error!",text:"Please check the form fields",icon:"error"})}else r.fire({title:"Error!",text:s.message||"An error occurred",icon:"error"})}finally{e.submitBtn.disabled=!1,e.submitBtn.innerHTML='<i class="fas fa-save"></i> '+(f==="create"?"Save Policy":"Update Policy")}}async function x(i){try{if(!(await fetch("/policies/"+i,{method:"DELETE",headers:{"X-CSRF-TOKEN":w,Accept:"application/json"}})).ok)throw new Error("Delete failed");_(),E(),r.fire({title:"Deleted!",text:"Policy has been deleted successfully.",icon:"success",timer:2e3,showConfirmButton:!1})}catch(t){console.error("Error:",t),r.fire({title:"Error!",text:"Error deleting policy",icon:"error"})}}
