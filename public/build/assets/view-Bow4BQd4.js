function T(){const e=document.getElementById("img-thumb-path");if(!e)return;const n=document.createElement("div");n.style.cssText=`
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
    `;const i=document.createElement("div");i.style.cssText=`
        position: relative;
        max-width: 80%;
        max-height: 80%;
    `;const t=document.createElement("img");t.src=e.src,t.style.cssText=`
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
    `;const a=document.createElement("span");a.textContent="×",a.style.cssText=`
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
    `,a.onclick=()=>document.body.removeChild(n),n.onclick=o=>{o.target===n&&document.body.removeChild(n)},i.appendChild(t),i.appendChild(a),n.appendChild(i),document.body.appendChild(n)}window.verifyDataAndOpenWindow=function(){var n;const e=((n=window.authData)==null?void 0:n.userCredit)||0;Swal.fire({title:'<span style="color: #4f46e5;">Fetching Client Data</span>',imageUrl:"https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif",imageWidth:180,imageHeight:120,imageAlt:"Loading",html:`
            <div class="progress-container">
                <div id="progress-bar"></div>
            </div>
            <div style="margin-top: 0.5rem;">
                <div class="loading-message"><i class="fas fa-user" style="color: #667eea; width: 20px;"></i> Client: <span id="loadingClientName">Loading...</span></div>
                <div class="loading-message"><i class="fas fa-map-marker-alt" style="color: #667eea; width: 20px;"></i> Address: <span id="loadingClientAddress">Loading...</span></div>
                <div class="loading-message"><i class="fas fa-car" style="color: #667eea; width: 20px;"></i> Plate: <span id="loadingPlateNo">Loading...</span></div>
                <div class="loading-message"><i class="fas fa-file-alt" style="color: #667eea; width: 20px;"></i> MV File: <span id="loadingMvFileNo">Loading...</span></div>
            </div>
        `,allowOutsideClick:!1,showConfirmButton:!1,background:"rgba(255, 255, 255, 0.98)",backdrop:`
            rgba(79, 70, 229, 0.08)
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23667eea' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")
        `,didOpen:()=>{let i=0;const t=document.getElementById("progress-bar"),a=setInterval(()=>{i+=Math.random()*10+5,i>=100&&(i=100,clearInterval(a)),t.style.width=`${i}%`},200)}}),setTimeout(()=>{var u,c,f,p,g,w,v;var i=((u=window.authData)==null?void 0:u.clientName)||"",t=((c=window.authData)==null?void 0:c.clientAddress)||"",a=((f=window.authData)==null?void 0:f.plateNo)||"",o=((p=window.authData)==null?void 0:p.mvFileNo)||"",l=((g=window.authData)==null?void 0:g.cocNo)||"",s=((w=window.authData)==null?void 0:w.orNo)||"",r=((v=window.authData)==null?void 0:v.policyNo)||"";l=l.toUpperCase(),document.getElementById("loadingClientName").textContent=i||"No data available",document.getElementById("loadingClientAddress").textContent=t||"No data available",document.getElementById("loadingPlateNo").textContent=a||"No data available",document.getElementById("loadingMvFileNo").textContent=o||"No data available",setTimeout(()=>{if(e<=10){Swal.fire({title:'<span style="color: #ef4444;">Service Failed</span>',html:'<div style="text-align:center;"><i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;"></i><p>Request Limit Reached Balance Uphold.</p></div>',icon:"error",confirmButtonText:"OK",customClass:{confirmButton:"swal2-confirm-error"}});return}if(/(\.{2,})|[-\/]{2,}|,{2,}|`{2,}/.test(i)){Swal.fire({title:'<span style="color: #ef4444;">Invalid Name Format</span>',html:`<div style="text-align:center;">
                            <i class="fas fa-exclamation-circle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;"></i>
                            <p>The client name contains invalid characters. Multiple periods, hyphens, slashes, commas, or backticks are not allowed.</p>
                            <p style="font-weight:600;margin-top:1rem;">Please edit the name to continue.</p>
                          </div>`,showCancelButton:!0,confirmButtonText:"Edit Name",cancelButtonText:"Cancel",customClass:{confirmButton:"swal2-confirm-error"}}).then(h=>{h.isConfirmed&&window.openEditModal()});return}if(l>=1&&l<=200){F(i,t,a,o,l,s,r);return}if(l.length===6&&l.startsWith("87")){O(i,t,a,o,l,s,r);return}E(i,t,a,o,l,s,r)},1e3)},1500)};function E(e,n,i,t,a,o,l){Swal.close();var s=`
        <div style="margin-top:1.5rem;text-align:left;">
            <div class="client-detail"><strong>Client Name:</strong> <span>${e}</span></div>
            <div class="client-detail"><strong>Address:</strong> <span>${n}</span></div>
            <div class="client-detail"><strong>Plate Number:</strong> <span>${i}</span></div>
            <div class="client-detail"><strong>MV File No:</strong> <span>${t}</span></div>
        </div>
    `;Swal.fire({title:'<span style="color: #4f46e5;">Confirm Details</span>',html:`
            <div style="text-align:center;">
                <p style="margin-bottom:1.5rem;">Please verify all details before proceeding. Ensure everything is correct.</p>
            </div>
            ${s}
        `,imageUrl:null,showCancelButton:!0,confirmButtonText:"Confirm & Proceed",cancelButtonText:"Review Details",focusConfirm:!1,allowOutsideClick:!1,backdrop:"rgba(79, 70, 229, 0.08)"}).then(r=>{var u;if(r.isConfirmed){const c={log:`Generated Authentication with Confirmation of Cover Bearing No: "${a}" to MV file No. : "${t}"`,session:((u=window.authData)==null?void 0:u.userFullname)||"System"};fetch("insert_log.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(c).toString()}).then(f=>f.text()).then(f=>console.log("Log saved:",f)).catch(f=>console.error("Error saving log:",f)),L(a,o,l),P(a)}}),document.querySelectorAll(".client-detail").forEach((r,u)=>{setTimeout(()=>{r.style.opacity="1",r.style.transform="translateY(0)"},100*u)})}function L(e,n,i){var b,m,d,C,I,k,B,N,S;var t=((b=window.authData)==null?void 0:b.clientName)||"",a=((m=window.authData)==null?void 0:m.clientAddress)||"",o=((d=window.authData)==null?void 0:d.plateNo)||"",l=((C=window.authData)==null?void 0:C.mvFileNo)||"",s=((I=window.authData)==null?void 0:I.chassisNo)||"",r=((k=window.authData)==null?void 0:k.engineNo)||"",u=((B=window.authData)==null?void 0:B.clientName)||"",c=((N=window.authData)==null?void 0:N.clientAddress)||"",f=((S=window.authData)==null?void 0:S.insuranceId)||"",p="https://primeone.com.ph/issuance?";p+="assured_name="+encodeURIComponent(t),p+="&assured_address="+encodeURIComponent(a),p+="&plate_no="+encodeURIComponent(o),p+="&mvfile_no="+encodeURIComponent(l),p+="&chassis_no="+encodeURIComponent(s),p+="&motor_no="+encodeURIComponent(r),p+="&fullname="+encodeURIComponent(u),p+="&address="+encodeURIComponent(c),p+="&or_no="+encodeURIComponent(n),p+="&coc_no="+encodeURIComponent(e),p+="&policy_no="+encodeURIComponent(i);var g=Math.floor(screen.width*.49),w=Math.floor(screen.width*.01),v=`width=${g},height=${screen.height},scrollbars=yes,resizable=yes,toolbar=no,location=no`,h=window.open(`/authenticate/index?id=${f}`,"authWindow",`${v},left=0,top=0`),y=window.open(p,"ectplWindow",`${v},left=${g+w},top=0`);h?(h.focus(),console.log("Authentication window opened successfully")):(console.error("Popup blocker may be preventing the authentication window from opening"),alert("Please allow popups for this site to continue")),y?(y.focus(),console.log("ECTPL window opened successfully")):console.error("Popup blocker may be preventing the ECTPL window from opening"),window.addEventListener("resize",function(){h&&!h.closed&&h.resizeTo(Math.floor(screen.width*.48),screen.height),y&&!y.closed&&(y.resizeTo(Math.floor(screen.width*.48),screen.height),y.moveTo(Math.floor(screen.width*.48)+w,0))})}function F(e,n,i,t,a,o,l){Swal.fire({title:'<span style="color: #ef4444;">Invalid COC Number</span>',html:`
            <div style="text-align:center;margin-bottom:1.5rem;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#f59e0b;"></i>
                <p style="margin-top:1rem;">The Certificate of Coverage number is invalid (1-200). To proceed, enable bypass mode and enter valid details.</p>
            </div>
            <div class="checkbox-container">
                <input id="enableBypassMode" type="checkbox">
                <label for="enableBypassMode">Enable Bypass Mode</label>
            </div>
            <div id="formFields">
                <div class="form-field">
                    <label for="orNoInput">Official Receipt No.</label>
                    <input id="orNoInput" class="swal2-input" type="text" placeholder="Enter 8-digit OR Number" maxlength="8" pattern="\\d{8}" inputmode="numeric">
                </div>
                <div class="form-field">
                    <label for="cocNoInput">Certificate of Coverage No.</label>
                    <input id="cocNoInput" class="swal2-input" type="text" placeholder="Enter 8-digit COC Number" maxlength="8" pattern="\\d{8}" inputmode="numeric">
                </div>
                <div class="form-field">
                    <label for="policyNoInput">Policy No.</label>
                    <input id="policyNoInput" class="swal2-input" type="text" placeholder="Enter 8-digit Policy Number" maxlength="8" pattern="\\d{8}" inputmode="numeric">
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:"Submit",cancelButtonText:"Cancel",focusConfirm:!1,preConfirm:()=>{if(!document.getElementById("enableBypassMode").checked)return Swal.showValidationMessage("You must enable bypass mode to proceed"),!1;const r=document.getElementById("orNoInput").value,u=document.getElementById("cocNoInput").value,c=document.getElementById("policyNoInput").value;return!/^\d{8}$/.test(r)||!/^\d{8}$/.test(u)||!/^\d{8}$/.test(c)?(Swal.showValidationMessage("All fields must contain exactly 8 digits"),!1):{cocNo:u,orNo:r,policyNo:c}}}).then(s=>{s.isConfirmed&&(a=s.value.cocNo,o=s.value.orNo,l=s.value.policyNo,E(e,n,i,t,a,o,l))}),document.getElementById("enableBypassMode").addEventListener("change",function(){const s=document.getElementById("formFields"),r=Swal.getConfirmButton();this.checked?(s.classList.add("visible"),r.disabled=!1):(s.classList.remove("visible"),r.disabled=!0)})}function O(e,n,i,t,a,o,l){Swal.fire({title:'<span style="color: #f59e0b;">Milestone COC Detected</span>',html:`
            <div style="text-align:center;margin-bottom:1.5rem;">
                <i class="fas fa-info-circle" style="font-size:3rem;color:#f59e0b;"></i>
                <p style="margin-top:1rem;">The COC number starts with 87 and has 6 digits. Please enter the correct COC number in the format: <strong>J123456</strong> (letter + 6 digits)</p>
            </div>
            <div class="form-field">
                <label for="cocNoInput">Milestone COC Number</label>
                <input id="cocNoInput" class="swal2-input" type="text" 
                    placeholder="Enter COC (e.g. J123456)" 
                    value="${a}" 
                    maxlength="7" 
                    pattern="[A-Za-z]\\d{6}" 
                    style="text-transform: uppercase;">
            </div>
        `,showCancelButton:!0,confirmButtonText:"Update",cancelButtonText:"Cancel",focusConfirm:!1,preConfirm:()=>{const s=document.getElementById("cocNoInput").value.toUpperCase();return/^[A-Z]\d{6}$/.test(s)?s:(Swal.showValidationMessage("COC must start with a letter followed by 6 digits (e.g. J123456)"),!1)}}).then(s=>{s.isConfirmed&&(a=s.value,E(e,n,i,t,a,o,l))})}function P(e){const n=`authCheck_${e}`,i=localStorage.getItem(n);if(i){const t=JSON.parse(i);if(t.isActive&&t.timestamp&&Date.now()-t.timestamp<3e5){D(e,t.timeLeft,t.currentAuthCode);return}else localStorage.removeItem(n)}D(e,300,null)}function D(e,n,i){let t,a,o=n,l=i,s=!1,r=!1;const u=`authCheck_${e}`,c=()=>{localStorage.setItem(u,JSON.stringify({isActive:!s&&o>0,timeLeft:o,currentAuthCode:l,timestamp:Date.now(),clientcoc:e}))},f=m=>{const d=Math.floor(m/60),C=m%60;return`${d}:${C<10?"0":""}${C}`},p=m=>{if(!s&&o>0)return c(),m.preventDefault(),m.returnValue="You have an ongoing authentication process. Your progress will be saved.",m.returnValue},g=m=>{!s&&o>0&&(m.ctrlKey&&(m.key==="r"||m.key==="R")||m.key==="F5")&&(r||(h(),r=!0,setTimeout(()=>{r=!1},1e3)),m.preventDefault())};let w=Date.now();const v=()=>{!s&&o>0&&(document.hidden?Date.now()-w>1e3&&y():w=Date.now())},h=()=>{Swal.fire({title:"Authentication in Progress",html:`<div style="text-align: left;">
                  <p>Your authentication for <strong>${e}</strong> is still pending.</p>
                  <p>⚠️ <strong>Don't worry!</strong> Your session will be automatically restored.</p>
                  <p>Time remaining: ${f(o)}</p>
                  </div>`,icon:"info",confirmButtonText:"Continue Authentication",backdrop:"rgba(0,0,0,0.7)",allowOutsideClick:!1})},y=()=>{Swal.fire({title:"Stay on This Page",html:`<div style="text-align: left;">
                  <p>Please complete the authentication on this tab first.</p>
                  <p>Your session will not transfer to new tabs.</p>
                  <p>Time remaining: ${f(o)}</p>
                  </div>`,icon:"warning",confirmButtonText:"Return to Authentication",backdrop:"rgba(0,0,0,0.7)",allowOutsideClick:!1}).then(()=>{window.focus()})};b(e),a=setInterval(()=>{s||b(e)},5e3),Swal.fire({title:"Waiting for Authentication",html:`Please complete the authentication process for COC: <strong>${e}</strong><br><br>
               <div id="time-left">Time remaining: ${f(o)}</div>
               <div id="auth-code" style="margin: 10px 0; font-weight: bold;"></div>
               <div id="status-message" class="text-info">Checking status...</div>
               <div class="progress-bar"><div class="progress" style="width: ${o/300*100}%"></div></div>`,imageUrl:"https://cdn-icons-png.flaticon.com/512/4207/4207257.png",imageWidth:80,imageHeight:80,allowOutsideClick:!1,allowEscapeKey:!1,showConfirmButton:!1,didOpen:()=>{window.addEventListener("beforeunload",p),window.addEventListener("keydown",g),document.addEventListener("visibilitychange",v),t=setInterval(()=>{o--;const m=Math.floor(o/60),d=o%60,C=o/300*100;document.getElementById("time-left").innerHTML=`Time remaining: ${m}:${d<10?"0"+d:d}`,document.querySelector(".progress").style.width=`${C}%`,c(),o<=0&&(clearInterval(t),clearInterval(a),localStorage.removeItem(u),Swal.fire({title:"Timeout",text:"Authentication process timed out. Please try again.",icon:"error",confirmButtonText:"OK"}))},1e3)},willClose:()=>{clearInterval(t),clearInterval(a),window.removeEventListener("beforeunload",p),window.removeEventListener("keydown",g),document.removeEventListener("visibilitychange",v),s||localStorage.removeItem(u)}});function b(m){fetch(`/check_authentication.php?coc_no=${encodeURIComponent(m)}&current_auth=${encodeURIComponent(l)}&_=${Date.now()}`).then(d=>{if(!d.ok)throw new Error("Network response was not ok");return d.json()}).then(d=>{if(d.error){document.getElementById("status-message").innerHTML=`<span class="text-danger">${d.error}</span>`;return}d.auth_renewal&&(document.getElementById("auth-code").innerHTML=`Authentication Code: <span class="text-primary">${d.auth_renewal}</span>`),l===null?(l=d.auth_renewal,c()):d.auth_renewal&&d.auth_renewal!==l?(s=!0,clearInterval(t),clearInterval(a),localStorage.removeItem(u),document.getElementById("status-message").innerHTML='<span class="text-success">New authentication detected!</span>',new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3").play().catch(I=>console.log("Audio play failed:",I)),Notification.permission==="granted"&&new Notification("New Authentication",{body:"A new authentication code has been received!"}),setTimeout(()=>{window.location.reload()},2e3)):document.getElementById("status-message").innerHTML=d.message||"Waiting for new authentication code..."}).catch(d=>{document.getElementById("status-message").innerHTML=`<span class="text-danger">Error checking status: ${d.message}</span>`})}}window.addEventListener("load",()=>{var t,a,o;const e=((t=window.authData)==null?void 0:t.cocNo)||null,n=((a=window.authData)==null?void 0:a.orNo)||"",i=((o=window.authData)==null?void 0:o.policyNo)||"";if(e){const l=`authCheck_${e}`,s=localStorage.getItem(l);if(s){const r=JSON.parse(s);if(r.isActive&&r.timestamp&&Date.now()-r.timestamp<3e5){Swal.fire({title:"Session Restored",html:`We found an ongoing authentication for COC: <strong>${e}</strong><br>
                           <p>Time remaining: ${U(r.timeLeft)}</p>`,icon:"info",confirmButtonText:"Continue Authentication"}).then(u=>{u.isConfirmed&&(L(e,n,i),P(e))});return}else localStorage.removeItem(l)}}});function U(e){const n=Math.floor(e/60),i=e%60;return`${n}:${i<10?"0":""}${i}`}window.checkPolicyStatus=function(e,n,i,t,a){a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Processing...',a.style.backgroundColor="#FF9800",a.disabled=!0,Swal.fire({title:'<div class="swal-policy-check-title">Verifying Policy Status</div>',html:`
            <div class="swal-policy-check-container">
                <div class="swal-policy-check-spinner">
                    <div class="swal-policy-check-spinner-outer"></div>
                    <div class="swal-policy-check-spinner-inner"></div>
                </div>
                <div class="swal-policy-check-progress-container">
                    <div id="swal-policy-check-progress-bar" class="swal-policy-check-progress-bar"></div>
                </div>
                <p class="swal-policy-check-message">Validating motor vehicle details with insurance provider...</p>
            </div>
        `,width:500,padding:"2em",background:"#fff",allowOutsideClick:!1,showConfirmButton:!1,customClass:{popup:"swal-policy-check-popup",title:"swal-policy-check-title-container"},didOpen:()=>{let o=0;const l=document.getElementById("swal-policy-check-progress-bar"),s=setInterval(()=>{o+=Math.random()*15+5,o>100&&(o=100),l.style.width=`${o}%`,o>=100&&clearInterval(s)},200)}}),setTimeout(function(){const o=parseInt(t);if((isNaN(o)||o>=1&&o<=999)&&M(t).name==="Unknown Policy"){x("Policy Not Released","https://static-00.iconduck.com/assets.00/circle-help-icon-512x512-udf9v5el.png","Unknown Policy",t,"Cannot release - Unknown policy number in restricted range","FF0000","error"),A(a);return}const l=M(t);n==1||e==0?x("Policy Released!",l.logo,l.name,t,i,"4CAF50","success"):x("Policy Pending",l.logo,l.name,t,"Not yet released","FF6347","warning"),A(a)},2e3)};function M(e){let n={name:"Unknown Policy",logo:"https://static-00.iconduck.com/assets.00/circle-help-icon-512x512-udf9v5el.png"};return e.startsWith("13")||e.startsWith("40")||e.startsWith("24")?(n.name="Liberty Insurance Corporation",n.logo="https://ectpl-vimsys.com/logo11.png"):e.startsWith("87")||e.length===6?(n.name="Milestone Guaranty And Assurance Corp.",n.logo="https://ectpl-vimsys.com/logo33.jpg"):e.startsWith("19")&&(n.name="Pacific Union Insurance Company",n.logo="https://ectpl-vimsys.com/logo44.jpg"),n}function x(e,n,i,t,a,o,l){Swal.fire({title:`<div class="swal-policy-result-title">${e}</div>`,html:`
            <div class="swal-policy-result-container">
                <div class="swal-policy-result-logo" style="border-color: #${o}">
                    <img src="${n}" alt="${i} Logo">
                </div>
                <div class="swal-policy-result-details">
                    <div class="swal-policy-result-company" style="color: #${o}">
                        <i class="fas fa-building"></i> ${i}
                    </div>
                    <div class="swal-policy-result-coc">
                        <i class="fas fa-file-alt"></i> COC No: ${t}
                    </div>
                    <div class="swal-policy-result-date">
                        <i class="fas fa-calendar-alt"></i> ${a}
                    </div>
                </div>
            </div>
        `,icon:l,confirmButtonText:"Got it!",width:550,padding:"2em",background:"#fff",customClass:{popup:"swal-policy-result-popup",title:"swal-policy-result-title-container",confirmButton:"swal-policy-result-confirm-btn"},showClass:{popup:"swal-policy-result-show"},hideClass:{popup:"swal-policy-result-hide"}})}function A(e){e.innerHTML='<i class="fas fa-check-circle"></i> Check Status',e.style.backgroundColor="",e.disabled=!1}window.openEditModal=function(){const e=document.getElementById("manageInsuranceModal"),n=document.getElementById("insuranceModalOverlay");e&&n&&(e.style.display="flex",n.style.display="block",setTimeout(()=>{typeof $<"u"&&$.fn.select2&&$(".js-example-basic-single").select2({width:"100%",dropdownParent:$("#manageInsuranceModal")})},100))};window.closeInsuranceModal=function(){const e=document.getElementById("manageInsuranceModal"),n=document.getElementById("insuranceModalOverlay");e&&(e.style.display="none"),n&&(n.style.display="none")};window.deleteInsurance=function(){Swal.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(e=>{if(e.isConfirmed){const n=document.querySelector('meta[name="csrf-token"]').content,i=new FormData;i.append("_method","DELETE"),i.append("_token",n),fetch(window.insuranceDestroyUrl,{method:"POST",headers:{"X-CSRF-TOKEN":n,Accept:"application/json"},body:i}).then(t=>{if(!t.ok)throw new Error("Network response was not ok");return t.json()}).then(t=>{t.success?Swal.fire("Deleted!","Insurance record has been deleted.","success").then(()=>{window.location.href=window.insurancesIndexUrl}):Swal.fire("Error!",t.message||"Failed to delete insurance record.","error")}).catch(t=>{console.error("Error:",t),Swal.fire("Deleted!","Insurance record has been deleted.","success").then(()=>{window.location.href=window.insurancesIndexUrl})})}})};window.autoFillExpirationDate=function(){const e=document.getElementById("modal-registration_date"),n=document.getElementById("modal-expiration_date");if(e&&n&&e.value){const i=new Date(e.value),t=new Date(i);t.setFullYear(t.getFullYear()+1);const a=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),l=String(t.getDate()).padStart(2,"0"),s=`${a}-${o}-${l}`;n.value=s,n.dispatchEvent(new Event("change")),console.log("Expiration date auto-filled:",s)}};document.addEventListener("DOMContentLoaded",function(){const e=document.getElementById("img-thumb-path"),n=document.getElementById("view-profile-text");e&&e.addEventListener("click",T),n&&n.addEventListener("click",T);const i=document.getElementById("edit_data");i&&(window.userPermissions>0?i.addEventListener("click",function(){window.openEditModal()}):i.style.display="none");const t=document.getElementById("delete_data");t&&(window.userPermissions===1?t.addEventListener("click",function(){window.deleteInsurance()}):t.style.display="none");const a=document.getElementById("modal-registration_date");a&&a.addEventListener("change",function(){window.autoFillExpirationDate()});const o=document.getElementById("insuranceForm");o&&o.addEventListener("submit",function(l){l.preventDefault();const s=document.getElementById("insuranceSubmitBtn");s.disabled=!0,s.innerHTML='<i class="fas fa-spinner fa-spin"></i> Updating...';const r=new FormData(o),u=document.querySelector('meta[name="csrf-token"]').content;fetch(window.insuranceUpdateUrl,{method:"POST",headers:{"X-CSRF-TOKEN":u,Accept:"application/json"},body:r}).then(c=>(console.log("Response status:",c.status),c.json())).then(c=>{console.log("Update response:",c),c.success?(window.closeInsuranceModal(),Swal.fire({title:"Success!",text:"Insurance record updated successfully!",icon:"success",timer:2e3,showConfirmButton:!1}).then(()=>{window.location.reload()})):Swal.fire("Error!",c.message||"Failed to update insurance record.","error")}).catch(c=>{console.error("Error:",c),Swal.fire("Error!","An error occurred while updating the record.","error")}).finally(()=>{s.disabled=!1,s.innerHTML='<i class="fas fa-check-circle"></i> Update Record'})})});
