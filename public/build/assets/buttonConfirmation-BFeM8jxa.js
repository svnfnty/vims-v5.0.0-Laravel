window.selectCertificateOfCoverage=function(){_({title:"Certificate of Coverage",documentType:"Certificate",optionsList:[{value:"One",label:"Liberty Insurance Corporation"},{value:"Two",label:"Pacific Union Insurance Corporation"},{value:"Three",label:"Milestone Insurance Corporation"},{value:"Four",label:"Stronghold Insurance Company"},{value:"Five",label:"Western Guaranty Corporation",isNew:!0}]})};function _(d){const{title:c,documentType:s,optionsList:n,cost:i=0,markup:b=""}=d;if(i===0&&s!=="Certificate"){Swal.fire({icon:"error",title:'<span style="font-weight:600">Pricing Unavailable</span>',html:`
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
            `,confirmButtonText:"OK",confirmButtonColor:"#6c757d"});return}Swal.fire({title:`<div style="font-size:1.5rem; font-weight:600; color:#212529;">Select ${c}</div>`,html:`
            <div style="max-width:500px; margin:0 auto;">
                <div style="background:#f8f9fa; border-radius:12px; padding:20px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; margin-bottom:15px;">
                        <img src="https://www.documation.com/assets/printAnimation.gif" alt="Printer Loading" style="width:60px; height:60px; margin-right:15px; border-radius:6px;">
                        <div>
                            <p style="font-weight:500; margin-bottom:5px; color:#212529;">Printer Preparation</p>
                            <p style="font-size:0.9rem; color:#868e96; margin:0;">Load official document paper into the printer</p>
                        </div>
                    </div>
                    ${i>0?`
                    <div style="
                        background: linear-gradient(to right, ${b?H():"#2575fc"}, #2575fc);
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
                            ${b?`<span style="font-size:1rem; opacity:0.85;">${b} + ₱${i} </span>`:""}
                        </p>
                    </div>
                    `:""}
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.9rem; color:#495057; margin-bottom:8px; font-weight:500;">Select Template</label>
                    <select id="cusSelectbox" style="width:100%; padding:12px 15px; border:1px solid #e9ecef; border-radius:8px; background-color:#fff; font-size:1rem; color:#495057; transition:all 0.2s; appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 15px center; background-size:15px;">
                        <option value="" selected disabled>Choose a template...</option>
                        ${n.map(t=>{const r=t.isNew?" ✨ New Template 50%":"";return`<option value="${t.value}">${t.label}${r}</option>`}).join("")}
                    </select>
                </div>

                <div style="font-size:0.8rem; color:#adb5bd; text-align:center; margin-top:10px;">
                    <svg style="vertical-align:-2px; margin-right:5px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>
                    Select the appropriate template for your ${s.toLowerCase()}
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
                            `,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"Go Back",reverseButtons:!0}).then(r=>r.dismiss===Swal.DismissReason.cancel?!1:t):t:(Swal.showValidationMessage("Please select a template to proceed"),!1)},didOpen:()=>{const t=document.getElementById("cusSelectbox");t.addEventListener("focus",()=>{t.style.borderColor="#80bdff",t.style.boxShadow="0 0 0 0.2rem rgba(0, 123, 255, 0.25)"}),t.addEventListener("blur",()=>{t.style.borderColor="#e9ecef",t.style.boxShadow="none"})}}).then(t=>{t.isConfirmed&&(Y(),setTimeout(()=>{const r=n.find(p=>p.value===t.value),$=K(t.value,r.label,s),e=document.createElement("iframe");e.style.display="none",document.body.appendChild(e);const l=e.contentDocument||e.contentWindow.document;l.open(),l.write($),l.close(),e.onload=()=>{e.contentWindow.print(),setTimeout(()=>{document.body.removeChild(e)},1e3)},Swal.close()},1500))})}function H(d){return"#2575fc"}function K(d,c,s){var k,D,B,N,T,S,L,P,M,O,A,F,E,I,j,U,W,G,V;const n=((k=window.authData)==null?void 0:k.clientName)||"Client Name",i=((D=window.authData)==null?void 0:D.clientAddress)||"Client Address",b=((B=window.authData)==null?void 0:B.plateNo)||"Plate Number",t=((N=window.authData)==null?void 0:N.mvFileNo)||"MV File Number",r=((T=window.insuranceData)==null?void 0:T.cost)||0,$=new Date().toLocaleDateString(),e=((S=window.insuranceData)==null?void 0:S.policyNo)||"",l=((L=window.insuranceData)==null?void 0:L.orNo)||"",p=((P=window.insuranceData)==null?void 0:P.cocNo)||"",y=((M=window.insuranceData)==null?void 0:M.vehicleModel)||"",x=((O=window.insuranceData)==null?void 0:O.make)||"",g=((A=window.insuranceData)==null?void 0:A.category)||"",f=((F=window.insuranceData)==null?void 0:F.vehicleColor)||"",h=((E=window.insuranceData)==null?void 0:E.registrationNo)||"",u=((I=window.insuranceData)==null?void 0:I.chassisNo)||"",w=((j=window.insuranceData)==null?void 0:j.engineNo)||"",o=(U=window.insuranceData)!=null&&U.registrationDate?new Date(window.insuranceData.registrationDate).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}):"",m=(W=window.insuranceData)!=null&&W.expirationDate?new Date(window.insuranceData.expirationDate).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}):"",C=((G=window.insuranceData)==null?void 0:G.authRenewal)||"";(V=window.insuranceData)!=null&&V.code;const R=p>=1&&p<=500?"white":"inherit",v=e>=1&&e<=200?"white":"inherit",z=l>=1&&l<=200?"white":"inherit";let a=`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${c} - ${s}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; font-size: 25px; line-height: 1.5; font-weight: normal; color: #1c1e21; }
                .container { font-size: 15px; line-height: 1.5; font-weight: normal; color: #1c1e21; }
                .center { text-align: left !important; }
                .title { height: 18px; background-color: #fdfdfd; border: 2px solid transparent; color: #000000; position: relative; top: -10px; }
                .header, .body { border: 1px solid transparent; }
                .tbl { width: 1200px; }
                table, th, td { border: 3px solid transparent; font-size: 12px; }
                .list { width: 300px; }
                .table { position: relative; top: -20px; margin-bottom: -10px; }
            </style>
        </head>
        <body>
    `;switch(d){case"One":a+=`
                <div id="showOne" class="content py-3 myDiv" style="font-size:25px;">
                    <div class="card card-outline card-primary rounded-0 shadow" style="font-size:25px;">
                       
                        <div class="card-body" style="font-size:25px;">
                            <div class="container-fluid" id="outprint" style="font-size:25px;">
                                <br><br><br>
                                <div class="row-fluid body" style="font-size:25px;">
                                    <h5 class="title" style="font-size:25px;"><b>
                                        ${C?`<h4 style="text-align:right;font-size:25px;">${C}</h4>`:'<h4 style="text-align:right;font-size:25px; color:#ffffff;">&nbsp;</h4>'}
                                    </b></h5>
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
                                                    <b style="color:${R};font-size:25px;">046${p}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" colspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl" rowspan="2" style="text-align:center; font-size:25px;">
                                                    <b style="color: ${v}; font-size:25px;">${e}</b>
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
                                                    <b style="font-size:23px;">${n}</b>
                                                </td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                                <td style="text-align:right; font-size:25px;">
                                                    <b style="font-size:25px;"></b>
                                                </td>
                                                <td style="text-align:center; font-size:25px;">
                                                    <b style="color: ${z}; font-size:25px;">${l}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:23px;"><b style="font-size:23px;">${i}</b>
                                                </td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align: right; font-size:20px;"><b style="font-size:20px;">${o}</b></td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:25px;"></td>
                                                <td style="font-size:25px;"></td>
                                                <td style="font-size:25px;"></td>
                                                <td style="text-align:right; font-size:25px;">
                                                    <b style="font-size:20px;">${o}</b>
                                                </td>
                                                <td style="text-align:center; font-size:25px;">
                                                    <b style="font-size:20px;">${m}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="table" style="font-size:25px;">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${y}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${x}</b></td>
                                                <td class="center tbl" style="font-size:15px;"><b style="font-size:18px;">${g}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:18px;">${f}</b></td>
                                                <td style="text-align: center; font-size:25px;"><b style="font-size:20px;">${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${h}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${u}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${w}</b></td>
                                                <td class="center tbl" style="font-size:25px;"></td>
                                                <td class="center tbl" style="font-size:25px;"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Two":a+=`
                <div id="showTwo" class="content py-3  myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                       
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_pup">
                                <br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title"></h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></td>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2"></td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align: center;">
                                                    <b style="color: ${v};">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"></td>
                                                <td class="tbl " style="color: white;">a</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;"><b>${n}</b></td>
                                                <td class="tbl "></td>
                                                <td style="text-align:left;"><b>${o}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${z};">${l}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl" style="text-align:center;"><b>${i}</b></td>
                                                <td></td>
                                                <td style="text-align:left;"><b>${o}</b></td>
                                                <td style="text-align:center;"><b>${m}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${y}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${x}</b></td>
                                                <td class='center tbl'><b>${g}</b></td>
                                                <td class="tbl"><b>${f}</b></td>
                                                <td class="" style="text-align: center;"><b>${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${h}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${u}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${w}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Three":a+=`
                <div id="showThree" class="content py-3  myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                        
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_mil">
                                <br><br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title"></h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></td>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2"></td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align: center;">
                                                    <b style="color: ${v};">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"></td>
                                                <td class="tbl " style="color: white;">a</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;"><b>${n}</b></td>
                                                <td class="tbl "></td>
                                                <td style="text-align:left;"><b>${o}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${z};">${l}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl" style="text-align:center;"><b>${i}</b></td>
                                                <td></td>
                                                <td style="text-align:left;"><b>${o}</b></td>
                                                <td style="text-align:center;"><b>${m}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${y}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${x}</b></td>
                                                <td class='center tbl'><b>${g}</b></td>
                                                <td class="tbl"><b>${f}</b></td>
                                                <td class="" style="text-align: center;"><b>${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${h}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${u}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${w}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Four":a+=`
                <div id="showFour" class="content py-3  myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                      
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_strong">
                                <br><br><br><br><br><br><br><br><br><br>  <br><br>
                                <div class="row-fluid body">
                                    <h5 class="title"></h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></td>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2"></td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align: center;font-size:20px;">
                                                    <b style="color: ${v};font-size:20px;">${e}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"></td>
                                                <td class="tbl " style="color: white;">a</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;font-size:20px;"><b>${n}</b></td>
                                                <td class="tbl "></td>
                                                <td style="text-align:left;font-size:20px;"><b>${o}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${z};font-size:20px;">${l}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${i}</b></td>
                                                <td></td>
                                                <td style="text-align:left;font-size:20px;"><b>${o}</b></td>
                                                <td style="text-align:center;font-size:20px;"><b>${m}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${y}</b></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${x}</b></td>
                                                <td class='center tbl'><b style="text-align:center;font-size:20px;">${g}</b></td>
                                                <td class="tbl"><b style="text-align:center;font-size:20px;">${f}</b></td>
                                                <td class="" style="text-align: center;font-size:20px;"><b>${t}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${h}</b></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${u}</b></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${w}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;break;case"Five":a+=`
                <div class="client-info">
                    <div><strong>Policy Owner:</strong> ${n}</div>
                    <div><strong>Address:</strong> ${i}</div>
                    <div><strong>Plate No:</strong> ${b}</div>
                    <div><strong>MV File No:</strong> ${t}</div>
                    <div><strong>Issue Date:</strong> ${$}</div>
                </div>
                <div class="amount">Certificate of Coverage Issued</div>
                <div class="footer">${c} - Official Certificate (BETA)</div>
            `;break;default:a+=`
                <div class="client-info">
                    <div><strong>Client:</strong> ${n}</div>
                    <div><strong>Amount:</strong> ₱${r}.00</div>
                </div>
                <div class="footer">Unknown Template - ${s}</div>
            `}return a+=`
        </body>
        </html>
    `,a}function Y(d="Generating document...",c="This typically takes 2-3 seconds"){Swal.fire({title:'<div style="font-size:1.3rem; font-weight:600; color:#212529; margin-bottom:15px;">Preparing Document</div>',html:`
            <div style="max-width:400px; margin:0 auto; text-align:center;">
                <div style="position:relative; width:80px; height:80px; margin:0 auto 20px;">
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:4px solid #f1f3f5; border-radius:50%;"></div>
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:4px solid #28a745; border-radius:50%; border-top-color:transparent; animation:spin 1s linear infinite;"></div>
                    <svg style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </div>
                <p style="color:#495057; margin-bottom:5px;">${d}</p>
                <p style="font-size:0.9rem; color:#868e96;">${c}</p>
            </div>
        `,showConfirmButton:!1,allowOutsideClick:!1,willOpen:()=>{if(!document.getElementById("swal-loading-animation")){const s=document.createElement("style");s.id="swal-loading-animation",s.textContent=`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `,document.head.appendChild(s)}}})}
