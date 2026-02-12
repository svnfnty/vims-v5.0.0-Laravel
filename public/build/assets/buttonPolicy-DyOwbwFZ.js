window.selectPolicyofCover=function(){var a,i;if(typeof isLocked<"u"&&isLocked){wt();return}mt({title:"Policy of Cover",documentType:"Policy",optionsList:[{value:"One",label:"Liberty Insurance Corporation"},{value:"Two",label:"Pacific Union Insurance Corporation"},{value:"Three",label:"Milestone Insurance Corporation"},{value:"Four",label:"Stronghold Insurance Company"},{value:"Five",label:"Western Guaranty Corporation",isNew:!0}],cost:((a=window.insuranceData)==null?void 0:a.cost)||0,markup:((i=window.insuranceData)==null?void 0:i.markup)||""})};function ht(a){return"#2575fc"}function mt(a){const{title:i,documentType:n,optionsList:r,cost:o=0,markup:x=""}=a;if(o===0&&n!=="Certificate"){Swal.fire({icon:"error",title:'<span style="font-weight:600">Pricing Unavailable</span>',html:`
                <div style="text-align:center; max-width:400px; margin:0 auto;">
                    <div style="width:80px; height:80px; margin:0 auto 20px; background:#f8f9fa; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                        </svg>
                    </div>
                    <p style="color:#495057; margin-bottom:15px;">The system cannot retrieve pricing information for this document.</p>
                    <div style="background:#f8f9fa; padding:10px; border-radius:6px;">
                        <p style="font-size:0.9rem; color:#868e96; margin:0;">Verify the insurance details and try again</p>
                    </div>
                </div>
            `,confirmButtonText:"OK",confirmButtonColor:"#6c757d"});return}Swal.fire({title:`<div style="font-size:1.5rem; font-weight:600; color:#212529;">Select ${i}</div>`,html:`
            <div style="max-width:500px; margin:0 auto;">
                <div style="background:#f8f9fa; border-radius:12px; padding:20px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; margin-bottom:15px;">
                        <img src="https://i.gifer.com/ISSh.gif" alt="Printer Loading" style="width:60px; height:60px; margin-right:15px; border-radius:6px;">
                        <div>
                            <p style="font-weight:500; margin-bottom:5px; color:#212529;">Printer Preparation</p>
                            <p style="font-size:0.9rem; color:#868e96; margin:0;">Load official document paper into the printer</p>
                        </div>
                    </div>
                    ${o>0?`
                    <div style="
                        background: linear-gradient(to right, ${x?ht():"#2575fc"}, #2575fc);
                        border-radius: 10px;
                        padding: 20px;
                        color: white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    ">
                        <p style="font-size: 0.9rem; opacity: 0.9; margin: 0;">Transaction Amount</p>
                        <p style="font-size: 1.5rem; font-weight: 600; margin: 0;">
                            ${x?`<span style="font-size:1rem; opacity:0.85;">${x} + ₱${o} </span>`:""}
                        </p>
                    </div>
                    `:""}
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.9rem; color:#495057; margin-bottom:8px; font-weight:500;">Select Template</label>
                    <select id="cusSelectbox" style="width:100%; padding:12px 15px; border:1px solid #e9ecef; border-radius:8px; background-color:#fff; font-size:1rem; color:#495057; transition:all 0.2s; appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 15px center; background-size:15px;">
                        <option value="" selected disabled>Choose a template...</option>
                        ${r.map(t=>{const l=t.isNew?" ✨ New Template 50%":"";return`<option value="${t.value}">${t.label}${l}</option>`}).join("")}
                    </select>
                </div>

                <div style="font-size:0.8rem; color:#adb5bd; text-align:center; margin-top:10px;">
                    <svg style="vertical-align:-2px; margin-right:5px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>
                    Select the appropriate template for your ${n.toLowerCase()}
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:'<span style="display:flex; align-items:center; justify-content:center;"><svg style="margin-right:8px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Print Document</span>',cancelButtonText:"Cancel",confirmButtonColor:"#28a745",cancelButtonColor:"#f8f9fa",customClass:{confirmButton:"swal-confirm-button",cancelButton:"swal-cancel-button"},width:"600px",padding:"2rem",preConfirm:()=>{const t=document.getElementById("cusSelectbox").value;return t?t==="Five"?Swal.fire({title:"Beta Template Warning",html:`
                                <div style="text-align:center; max-width:400px; margin:0 auto;">
                                    <div style="width:80px; height:80px; margin:0 auto 20px; background:#fff3cd; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12" y2="17"></line>
                                        </svg>
                                    </div>
                                    <p style="color:#495057; margin-bottom:15px;">The <strong>Western Guaranty Corporation</strong> template is currently in <strong>BETA</strong> testing phase.</p>
                                    <div style="background:#fff3cd; padding:12px; border-radius:8px; margin-bottom:15px;">
                                        <p style="font-size:0.9rem; color:#856404; margin:0;">Please be advise that layout still broken, proceed with care.</p>
                                    </div>
                                </div>
                            `,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"Go Back",reverseButtons:!0}).then(l=>l.dismiss===Swal.DismissReason.cancel?!1:t):t:(Swal.showValidationMessage("Please select a template to proceed"),!1)},didOpen:()=>{const t=document.getElementById("cusSelectbox");t.addEventListener("focus",()=>{t.style.borderColor="#80bdff",t.style.boxShadow="0 0 0 0.2rem rgba(0, 123, 255, 0.25)"}),t.addEventListener("blur",()=>{t.style.borderColor="#e9ecef",t.style.boxShadow="none"})}}).then(t=>{t.isConfirmed&&(ft(),setTimeout(()=>{const l=r.find(g=>g.value===t.value),B=ut(t.value,l.label,n),e=document.createElement("iframe");e.style.display="none",document.body.appendChild(e);const d=e.contentDocument||e.contentWindow.document;d.open(),d.write(B),d.close(),e.onload=()=>{e.contentWindow.print(),setTimeout(()=>{document.body.removeChild(e)},1e3)},Swal.close()},1500))})}function ft(a="Generating document...",i="This typically takes 2-3 seconds"){Swal.fire({title:'<div style="font-size:1.3rem; font-weight:600; color:#212529; margin-bottom:15px;">Preparing Document</div>',html:`
            <div style="max-width:400px; margin:0 auto; text-align:center;">
                <div style="position:relative; width:80px; height:80px; margin:0 auto 20px;">
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:4px solid #f1f3f5; border-radius:50%;"></div>
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:4px solid #28a745; border-radius:50%; border-top-color:transparent; animation:spin 1s linear infinite;"></div>
                    <svg style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </div>
                <p style="color:#495057; margin-bottom:5px;">${a}</p>
                <p style="font-size:0.9rem; color:#868e96;">${i}</p>
            </div>
        `,showConfirmButton:!1,allowOutsideClick:!1,willOpen:()=>{if(!document.getElementById("swal-loading-animation")){const n=document.createElement("style");n.id="swal-loading-animation",n.textContent=`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `,document.head.appendChild(n)}}})}function wt(){Swal.fire({icon:"error",title:'<span style="font-weight:600">Reprint Restricted</span>',html:`
            <div style="text-align:center; max-width:400px; margin:0 auto;">
                <div style="width:80px; height:80px; margin:0 auto 20px; background:#f8f9fa; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="12" y1="17" x2="12" y2="17.01"></line>
                    </svg>
                </div>
                <p style="color:#495057; margin-bottom:10px;">This document is under RSU policy lock until:</p>
                <div style="background:#f1f3f5; padding:12px; border-radius:8px; margin-bottom:20px;">
                    <p style="font-size:1.1rem; color:#212529; margin:0;">${lockDate}</p>
                </div>
                <p style="font-size:0.9rem; color:#868e96;">Please contact administration for emergency access</p>
            </div>
        `,confirmButtonText:"Understood",confirmButtonColor:"#dc3545",customClass:{container:"swal-premium-container",popup:"swal-premium-popup"}})}function ut(a,i,n){var L,A,M,I,O,F,E,j,R,U,G,V,W,H,_,K,Y,q,J,Q,X,Z,tt,et,st,lt,nt,dt,at,it,rt,ot,ct,bt,pt,xt,gt;const r=((L=window.authData)==null?void 0:L.clientName)||"Client Name",o=((A=window.authData)==null?void 0:A.clientAddress)||"Client Address",x=((M=window.authData)==null?void 0:M.plateNo)||"Plate Number",t=((I=window.authData)==null?void 0:I.mvFileNo)||"MV File Number",l=((O=window.insuranceData)==null?void 0:O.cost)||0,B=new Date().toLocaleDateString(),e=((F=window.insuranceData)==null?void 0:F.policyNo)||"",d=((E=window.insuranceData)==null?void 0:E.orNo)||"",g=((j=window.insuranceData)==null?void 0:j.cocNo)||"",y=((R=window.insuranceData)==null?void 0:R.vehicleModel)||"",h=((U=window.insuranceData)==null?void 0:U.make)||"",m=((G=window.insuranceData)==null?void 0:G.category)||"",P=((V=window.insuranceData)==null?void 0:V.vehicleColor)||"",f=((W=window.insuranceData)==null?void 0:W.registrationNo)||"",w=((H=window.insuranceData)==null?void 0:H.chassisNo)||"",u=((_=window.insuranceData)==null?void 0:_.engineNo)||"",c=(K=window.insuranceData)!=null&&K.registrationDate?new Date(window.insuranceData.registrationDate).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}):"",v=(Y=window.insuranceData)!=null&&Y.expirationDate?new Date(window.insuranceData.expirationDate).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}):"",S=((q=window.insuranceData)==null?void 0:q.authRenewal)||"",N=((J=window.insuranceData)==null?void 0:J.code)||"",$=((Q=window.insuranceData)==null?void 0:Q.thirdPartyLiability)||"",b=((X=window.insuranceData)==null?void 0:X.personalAccident)||"",s=((Z=window.insuranceData)==null?void 0:Z.tppd)||"",z=((tt=window.insuranceData)==null?void 0:tt.documentaryStamps)||"",D=((et=window.insuranceData)==null?void 0:et.valueAddedTax)||"",k=((st=window.insuranceData)==null?void 0:st.localGovTax)||"",yt=g>=1&&g<=500?"white":"inherit",C=e>=1&&e<=200?"white":"inherit",T=d>=1&&d<=200?"white":"inherit";let p=`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${i} - ${n}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; font-size: 25px; line-height: 1.5; font-weight: normal; color: #1c1e21; }
                .container { font-size: 15px; line-height: 1.5; font-weight: normal; color: #1c1e21; }
                .center { text-align: left !important; }
                .title { height: 18px; background-color: #fdfdfd; border: 2px solid transparent; color: #000000; position: relative; top: -10px; }
                .header, .body { border: 1px solid transparent; }
                .tbl { width: 1200px; }
                .tbl { width: 1200px; }
                table, th, td { border: 3px solid transparent; font-size: 12px; }
                .list { width: 300px; }
                .table { position: relative; top: -20px; margin-bottom: -10px; }
            </style>
        </head>
        <body>
    `;switch(a){case"One":p+=`
                <div id="showOne" class="content py-3 myDiv" style="font-size:25px;">
                    <div class="card card-outline card-primary rounded-0 shadow" style="font-size:25px;">
                       
                        <div class="card-body" style="font-size:25px;">
                            <div class="container-fluid" id="outprint" style="font-size:25px;">
                                <br><br><br><br>
                                <div class="row-fluid body" style="font-size:25px;">
                                    <h5 class="title" style="font-size:25px;">
                                        <b>
                                            ${S?`<h4 style="text-align:right;font-size:25px;">${S}</h4>`:'<h4 style="text-align:right;font-size:25px; color:#ffffff;">&nbsp;</h4>'}
                                        </b>
                                    </h5>
                                    <table class="table" style="font-size:25px;">
                                        <tbody>
                                            <tr>
                                                <td class="list" rowspan="2" style="text-align:right; font-size:25px;">
                                                    <h4 style="font-size:25px;"></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align: right; font-size:25px;"></td>
                                                <td class="tbl" style="text-align:center; font-size:25px;">
                                                    <b style="color:${yt};font-size:25px;">046${g}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" colspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl" rowspan="2" style="text-align:center; font-size:25px;">
                                                    <b style="color: ${C}; font-size:25px;">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align:center; font-size:25px;">
                                                    <b style="font-size:25px;"></b>
                                                </td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:25px;"></td>
                                                <td class="tbl" style="text-align:center; font-size:25px;">
                                                    <b style="font-size:23px;">${r}</b>
                                                </td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                                <td style="text-align:right; font-size:25px;">
                                                    <b style="font-size:25px;"></b>
                                                </td>
                                                <td style="text-align:center; font-size:25px;">
                                                    <b style="color: ${T}; font-size:25px;">${d}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:23px;"><b style="font-size:23px;">${o}</b>
                                                </td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align: right; font-size:20px;"><b style="font-size:20px;">${c}</b></td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:25px;"></td>
                                                <td style="font-size:25px;"></td>
                                                <td style="font-size:25px;"></td>
                                                <td style="text-align:right; font-size:25px;">
                                                    <b style="font-size:20px;">${c}</b>
                                                </td>
                                                <td style="text-align:center; font-size:25px;">
                                                    <b style="font-size:20px;">${v}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="table" style="font-size:25px;">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${y}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${h}</b></td>
                                                <td class="center tbl" style="font-size:15px;"><b style="font-size:18px;">${m}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:18px;">${P}</b></td>
                                                <td style="text-align: center; font-size:25px;"><b style="font-size:20px;">${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${f}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${w}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${u}</b></td>
                                                <td class="center tbl" style="font-size:25px;"></td>
                                                <td class="center tbl" style="font-size:25px;"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class="">
                                        <tbody>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " rowspan="2" style="text-align:center;"></td>
                                                <td class="tbl center" rowspan="5" style="width: 90px; height: 20px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </tD>
                                                <td class="tbl ">
                                                    <font color="red" style="text-align:left;font-size: 20px;"></font>
                                                </tD>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td style="text-align:center;font-size: 10px;"></td>
                                                <td style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class='table' style='width: 956px;'>
                                        <tbody>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='' style='text-align: right;padding-top: 2px;padding-bottom: 2px;'><b>${$}</b></td>
                                            </tr>
                                            ${b?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${b}</b></td>
                                            </tr>
                                            `:""}
                                            ${s&&s!=0?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>TPPD ${s}</b></td>
                                            </tr>
                                            `:""}
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((lt=window.insuranceData)==null?void 0:lt.description)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${z}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((nt=window.insuranceData)==null?void 0:nt.description1)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${D}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((dt=window.insuranceData)==null?void 0:dt.description2)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${k}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>Total ${l}.00</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Two":p+=`
                <div id="showTwo" class="content py-3 myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                       
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_pup">
                                <br><br><br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title">Insurance Ref. Code :${N}</h5>
                                    <table class="table" style="width: 956px;>">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4>
                                                        </h5>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></tD>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2" style="color: white;">A</td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align:center;">
                                                    <b style="color: ${C};">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"><b></b></td>
                                                <td class="tbl "></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;"><b>${r}</b></td>
                                                <td class="tbl "></tD>
                                                <td style="text-align:right;"><b>${c}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${T};">${d}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " style="text-align:center;"><b>${o}</b></tD>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></tD>
                                                <td style="text-align:right;"><b>${c}</b></td>
                                                <td style="text-align:center;"><b>${v}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table" style="width: 956px;">
                                        <tbody>
                                            <tr style="height: 15px;">
                                                <td class="center tbl" colspan="1.3"><b>${y}</b></td>
                                                <td class="center tbl"> &emsp;&emsp;&emsp;&emsp;&emsp;<b>${h}</b></td>
                                                <td class='center tbl'>&emsp;&emsp;<b>${m}</b></td>
                                                <td class="center tbl">&emsp;&emsp;<b>${P}</b></td>
                                                <td class="" style="text-align: center;"><b>${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="center tbl"><b>${f}</b></td>
                                                <td class="center tbl">&emsp;&emsp;&emsp;<b style="text-align:left;font-size: 16px;">${w}</b></td>
                                                <td class="center tbl">&emsp;&emsp;<b style="text-align:left;font-size: 16px;">${u}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class="">
                                        <tbody>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " rowspan="2" style="text-align:center;"></td>
                                                <td class="tbl center" rowspan="5" style="width: 90px; height: 20px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </tD>
                                                <td class="tbl ">
                                                    <font color="red" style="text-align:left;font-size: 20px;"></font>
                                                </tD>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td style="text-align:center;font-size: 10px;"></td>
                                                <td style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class='table' style='width: 956px;'>
                                        <tbody>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='' style='text-align: right;padding-top: 2px;padding-bottom: 2px;'><b>${$}</b></td>
                                            </tr>
                                            ${b?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${b}</b></td>
                                            </tr>
                                            `:""}
                                            ${s&&s!=0?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>TPPD ${s}</b></td>
                                            </tr>
                                            `:""}
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((at=window.insuranceData)==null?void 0:at.description)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${z}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((it=window.insuranceData)==null?void 0:it.description1)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${D}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((rt=window.insuranceData)==null?void 0:rt.description2)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${k}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>Total ${l}.00</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Three":p+=`
                <div id="showThree" class="content py-3 myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                        
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_mil">
                                <br><br><br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title">Insurance Ref. Code :${N}</h5>
                                    <table class="table" style="width: 956px;>">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4>
                                                        </h5>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></tD>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2" style="color: white;">A</td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align:center;">
                                                    <b style="color: ${C};">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"><b></b></td>
                                                <td class="tbl "></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;"><b>${r}</b></td>
                                                <td class="tbl "></tD>
                                                <td style="text-align:right;"><b>${c}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${T};">${d}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " style="text-align:center;"><b>${o}</b></tD>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></tD>
                                                <td style="text-align:right;"><b>${c}</b></td>
                                                <td style="text-align:center;"><b>${v}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="table" style="width: 956px;">
                                        <tbody>
                                            <tr style="height: 15px;">
                                                <td class="center tbl" colspan="1.3"><b>${y}</b></td>
                                                <td class="center tbl"> &emsp;&emsp;&emsp;&emsp;&emsp;<b>${h}</b></td>
                                                <td class='center tbl'>&emsp;&emsp;<b style="font-size:12px;">${m}</b></td>
                                                <td class="center tbl">&emsp;&emsp;<b style="font-size:12px;">${P}</b></td>
                                                <td class="" style="text-align: center;"><b>${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="center tbl"><b>${f}</b></td>
                                                <td class="center tbl">&emsp;&emsp;&emsp;<b style="text-align:left;font-size: 16px;">${w}</b></td>
                                                <td class="center tbl">&emsp;&emsp;<b style="text-align:left;font-size: 16px;">${u}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class="">
                                        <tbody>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " rowspan="2" style="text-align:center;"></td>
                                                <td class="tbl center" rowspan="5" style="width: 90px; height: 20px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </tD>
                                                <td class="tbl ">
                                                    <font color="red" style="text-align:left;font-size: 20px;"></font>
                                                </tD>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td style="text-align:center;font-size: 10px;"></td>
                                                <td style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class='table' style='width: 956px;'>
                                        <tbody>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='' style='text-align: right;padding-top: 2px;padding-bottom: 2px;'><b>${$}</b></td>
                                            </tr>
                                            ${b?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${b}</b></td>
                                            </tr>
                                            `:""}
                                            ${s&&s!=0?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>TPPD ${s}</b></td>
                                            </tr>
                                            `:""}
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((ot=window.insuranceData)==null?void 0:ot.description)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${z}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((ct=window.insuranceData)==null?void 0:ct.description1)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${D}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b>${((bt=window.insuranceData)==null?void 0:bt.description2)||""}</b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${k}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>Total ${l}.00</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Four":p+=`
                <div id="showFour" class="content py-3 myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                       
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_strong">
                                <br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title">-</h5>
                                    <table class="table" style="width: 956px;>">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4>
                                                        </h5>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></tD>
                                                <td class="tbl " style="text-align:right;"><b></b></tD>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2" style="color: white;">A</td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align:center;">
                                                    <b style="color: ${C};font-size: 20px;">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"><b></b></td>
                                                <td class="tbl "></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;font-size: 20px;"><b>${r}</b></td>
                                                <td class="tbl "></tD>
                                                <td style="text-align:right;font-size: 20px;"><b>${c}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${T};">${d}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " style="text-align:center;font-size: 20px;"><b>${o}</b></tD>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></tD>
                                                <td style="text-align:right;font-size: 20px;"><b>${c}</b></td>
                                                <td style="text-align:center;font-size: 20px;"><b>${v}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 13px;font-size: 20px;">
                                                <td class="center tbl" colspan="1.3"><b>${y}</b></td>
                                                <td class="center tbl"> &emsp;&emsp;&emsp;&emsp;&emsp;<b>${h}</b></td>
                                                <td class='center tbl'>&emsp;&emsp;<b style="font-size: 20px;">${m}</b></td>
                                                <td class="center tbl">&emsp;&emsp;<b  style="font-size: 16px;">-</b></td>
                                                <td class="" style="text-align: center;"><b>${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;font-size: 20px;">
                                                <td class="center tbl"><b>${f}</b></td>
                                                <td class="center tbl">&emsp;&emsp;&emsp;<b style="text-align:left;font-size: 20px;">${w}</b></td>
                                                <td class="center tbl">&emsp;&emsp;<b style="text-align:left;font-size: 20px;">${u}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    <table class="">
                                        <tbody>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl " rowspan="2" style="text-align:center;"></td>
                                                <td class="tbl center" rowspan="5" style="width: 90px; height: 20px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </tD>
                                                <td class="tbl ">
                                                    <font color="red" style="text-align:left;font-size: 20px;"></font>
                                                </tD>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td style="text-align:center;font-size: 10px;"></td>
                                                <td style="text-align:center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<font color="red" style="text-align:right"></font>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br><br><br><br><br>
                                    <table class='table' style='width: 956px;'>
                                        <tbody>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='' style='text-align: right;padding-top: 2px;padding-bottom: 2px;'><b>${$}</b></td>
                                            </tr>
                                            ${b?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${b}</b></td>
                                            </tr>
                                            `:""}
                                            ${s&&s!=0?`
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>TPPD ${s}</b></td>
                                            </tr>
                                            `:""}
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b></b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${z}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b></b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${D}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='tbl' style='text-align:center;padding-top: 2px;padding-bottom: 2px;' colspan='3'><a style='font-size: 15px;'><center><b></b></center></a></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>${k}</b></td>
                                            </tr>
                                            <tr style='height: 25px;'>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class='center tbl'><b></b></td>
                                                <td class=' tbl' style='text-align:right;padding-top: 2px;padding-bottom: 2px;'><b>Total ${l}.00</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br><br><br><br><br><b>${((pt=window.insuranceData)==null?void 0:pt.description)||""}&emsp;${((xt=window.insuranceData)==null?void 0:xt.description1)||""}&emsp;${((gt=window.insuranceData)==null?void 0:gt.description2)||""}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Five":p+=`
                <div class="client-info">
                    <div><strong>Policy Owner:</strong> ${r}</div>
                    <div><strong>Address:</strong> ${o}</div>
                    <div><strong>Plate No:</strong> ${x}</div>
                    <div><strong>MV File No:</strong> ${t}</div>
                    <div><strong>Issue Date:</strong> ${B}</div>
                </div>
                <div class="amount">Policy of Cover Issued</div>
                <div class="footer">${i} - Official Policy (BETA)</div>
            `;break;default:p+=`
                <div class="client-info">
                    <div><strong>Client:</strong> ${r}</div>
                    <div><strong>Amount:</strong> ₱${l}.00</div>
                </div>
                <div class="footer">Unknown Template - ${n}</div>
            `}return p+=`
        </body>
        </html>
    `,p}
