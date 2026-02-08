const c=document.getElementById("img-thumb-path"),i=document.getElementById("view-profile-text");function s(){const e=document.createElement("div");e.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;const t=document.createElement("div");t.style.cssText=`
        position: relative;
        max-width: 80%;
        max-height: 80%;
    `;const n=document.createElement("img");n.src=c.src,n.style.cssText=`
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
    `;const r=document.createElement("span");r.textContent="×",r.style.cssText=`
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: white;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `,r.onclick=()=>document.body.removeChild(e),e.onclick=o=>{o.target===e&&document.body.removeChild(e)},t.appendChild(n),t.appendChild(r),e.appendChild(t),document.body.appendChild(e)}c.addEventListener("click",s);i.addEventListener("click",s);if(window.userPermissions>0)document.getElementById("edit_data").addEventListener("click",function(){d()});else{const e=document.getElementById("edit_data");e&&(e.style.display="none")}if(window.userPermissions===1)document.getElementById("delete_data").addEventListener("click",function(){l()});else{const e=document.getElementById("delete_data");e&&(e.style.display="none")}function d(){const e=document.getElementById("manageInsuranceModal"),t=document.getElementById("insuranceModalOverlay");e&&t&&(e.style.display="flex",t.style.display="block",setTimeout(()=>{$(".js-example-basic-single").select2({width:"100%",dropdownParent:$("#manageInsuranceModal")})},100))}function a(){const e=document.getElementById("manageInsuranceModal"),t=document.getElementById("insuranceModalOverlay");e&&(e.style.display="none"),t&&(t.style.display="none")}function l(){Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(e=>{if(e.isConfirmed){const t=document.querySelector('meta[name="csrf-token"]').content;fetch(insuranceDestroyUrl,{method:"DELETE",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":t,Accept:"application/json"}}).then(n=>n.json()).then(n=>{n.success?Swal.fire("Deleted!","Insurance record has been deleted.","success").then(()=>{window.location.href='{{ route("insurances.index") }}'}):Swal.fire("Error!",n.message||"Failed to delete insurance record.","error")}).catch(n=>{console.error("Error:",n),Swal.fire("Error!","An error occurred while deleting the record.","error")})}})}$(document).ready(function(){document.getElementById("insuranceSubmitBtn").addEventListener("click",function(e){e.preventDefault(),a();const t=document.getElementById("insuranceSubmitBtn");t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Updating...';const n=new FormData(document.getElementById("insuranceForm")),r=document.querySelector('meta[name="csrf-token"]').content;fetch(insuranceUpdateUrl,{method:"POST",headers:{"X-CSRF-TOKEN":r,Accept:"application/json"},body:n}).then(o=>(console.log("Response status:",o.status),o.json())).then(o=>{console.log("Update response:",o),o.success?Swal.fire({title:"Success!",text:"Insurance record updated successfully!",icon:"success",timer:2e3,showConfirmButton:!1}).then(()=>{window.location.reload()}):Swal.fire("Error!",o.message||"Failed to update insurance record.","error")}).catch(o=>{console.error("Error:",o),Swal.fire("Error!","An error occurred while updating the record.","error")}).finally(()=>{t.disabled=!1,t.innerHTML='<i class="fas fa-check-circle"></i> Update Record'})})});
