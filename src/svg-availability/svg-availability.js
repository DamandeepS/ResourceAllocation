import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './svg-availability.css';
import $ from 'jquery';
import "./bootstrap.js"
 /* eslint-disable */
var container = (
    <div className="main-container">
        <div className="svg-container">
            <svg width="100vw" height="100vh">
                <polygon  data-allocatable="true" data-allocated-id="" points="200,10 250,190 160,210" style={{'fill':"#c5f",'stroke':"rgb(123,12,43)",'strokeWidth':'1'}} > </polygon>

                  <rect data-allocatable="true" data-allocated-id="1361" x="0" y="0" rx="20" ry="20" width="100px" height="100px" style={{'fill':'red','stroke':'rgb(123,12,43)','strokeWidth':'1'}}></rect>
 <rect data-allocatable="false" data-allocated-id="" x="100" y="20" rx="20" ry="20" width="100px" height="100px" style={{'fill':'red','stroke':'rgb(123,12,43)','strokeWidth':'1'}}></rect>

            </svg>
        </div>
        <div className="controls">
            <input type="button" id="availability" className="btn btn-default" value="Show Availability"></input>
        </div>
        
        <div id="modal"></div>

        <div id="loader">
            <div className="loader"></div>
        </div>
</div>);

class SvgAvailability extends Component {
  render() {
    return container;
  }
}

 (function() {
    $(document).ready(function() {

        var svgAvailability = {
            'showAvailable': false,
            'selectedSvg': null,
            'allocatableSvgs': [],
            'modal': null,
            'isAvailable': function (svgParent) {
                return ($(svgParent).attr("data-allocated-id").toString()!="");

            },
            'calculateSvgAvailability': function() {
                svgAvailability.allocatableSvgs = $(".main-container > .svg-container > svg  *[data-allocatable='true']");
                console.log(svgAvailability.allocatableSvgs);
            },
            'addEditor': function() {
                svgAvailability.calculateSvgAvailability();
                $.each(svgAvailability.allocatableSvgs, function(index, svgParent) {
                    var edit = (<rect x="0" y="0" rx="20" ry="20" width="40px" height="40px" style={{'fill':'#000','stroke':'#fff','strokeWidth':'1','zIndex': 9999}}/>)
        
                    edit = ReactDOM.render(edit, svgParent)
                    edit = $(edit);
                    edit.on("click", function (e) {
                        var mainContainer = $(".main-container")[0];
                        if (!svgAvailability.isAvailable(svgParent)) {
                            mainContainer.dispatchEvent(new CustomEvent("allocate", {
                                detail : {
                                    callerSvg: svgParent
                                }
                            }));
                        } 
                        else {
                            mainContainer.dispatchEvent(new CustomEvent("de-allocate", {
                                detail : {
                                    callerSvg: svgParent
                                }
                            }));
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    })
                    svgParent.append(edit[0]);
                    });
            },
            'removeEditor': function() {
                svgAvailability.allocatableSvgs.find("button.edit").remove();
            },
            'initialize': function() {
                svgAvailability.initializeAvailability();
                svgAvailability.initializeModals();
                svgAvailability.initializeSvgInformation();
            },
            initializeAvailability: function () {
                $("#availability").on("click", function() {

                            svgAvailability.calculateSvgAvailability();
                            svgAvailability.showAvailable=!svgAvailability.showAvailable;
                            var unavailableSvgs = [];
                            $.each(svgAvailability.allocatableSvgs, function(index, svg) {
                                if (!svgAvailability.isAvailable(svg)) 
                                    unavailableSvgs.push(svg);
                            });
                            console.log(unavailableSvgs);
                            var opacity = "1";
                            if (svgAvailability.showAvailable) {
                                svgAvailability.addEditor();
                                opacity = "0.5";
                                
                            } else {
                                opacity = "1";
                                svgAvailability.removeEditor();
                            }

                            $.each(unavailableSvgs, function(index, svg) {
                                $(svg).find('svg').css("opacity",opacity);
                            });
                            
                            $(this).toggleClass("active");
                });

            },
            initializeModals: function () {
                var mainContainer = $(".main-container")[0];
                mainContainer.addEventListener("allocate", svgAvailability.allocate);
                mainContainer.addEventListener("de-allocate", svgAvailability.deAllocate);

            },
            allocate: function(customEvent) {
                svgAvailability.selectedSvg = customEvent.detail.callerSvg;

                var modalHeader = <h4 className="modal-title">Allocate</h4>,
                    modalBody = (
                            <div>
                                <div className="input-group">
                                    <span className="input-group-addon" id="basic-addon1">Emp Id*</span>
                                    <input type="text" id="allocate-emp-id" placeholder="example: 1001" name="allocate-emp-id" className="form-control" aria-describedby="basic-addon1" required></input>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-addon" id="basic-addon2">Comments</span>
                                    <input id="allocate-comments" aria-describedby="basic-addon2" className="form-control" ></input>
                                </div>
                            </div>
                        ),
                    submitBtnName = "Allocate",
                    cancelBtnName = "Close",
                    submitCallback = svgAvailability.allocateSubmit;

                Modal.createFormModal(modalHeader, modalBody, submitBtnName, cancelBtnName, submitCallback);
            },
            deAllocate: function (customEvent) {
                svgAvailability.selectedSvg = customEvent.detail.callerSvg;
                var empId = $(customEvent.detail.callerSvg).attr('data-allocated-id');

                var modalHeader = <h4 className="modal-title">De-allocate</h4>,
                    modalBody = (
                            <div>
                                <div className="input-group">
                                    <span className="input-group-addon" id="basic-addon1">Assigned To</span>
                                    <input readOnly type="text" id="deallocate-emp-id" placeholder="example: 1001" value={empId} name="deallocate-emp-id" className="form-control" aria-describedby="basic-addon1" required></input>
                                </div>
                                <br/>
                                <div className="input-group">
                                    <span className="input-group-addon" id="basic-addon1">Approval*</span>
                                    <input type="file" id="deallocate-approval" name="deallocate-approval" className="form-control" aria-describedby="basic-addon1" required></input>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-addon" id="basic-addon1">Reason*</span>
                                    <input type="text" id="deallocate-reason" placeholder="Reason for deallocation" name="deallocate-reason" className="form-control" aria-describedby="basic-addon1" required></input>
                                </div>
                            </div>
                        ),
                    submitBtnName = "De Allocate",
                    cancelBtnName = "Close",
                    submitCallback = svgAvailability.deAllocateSubmit;

                Modal.createFormModal(modalHeader, modalBody, submitBtnName, cancelBtnName, submitCallback);
            },
            restoreOpacity: function() {
                $(svgAvailability.allocatableSvgs).each(function (){
                    $(this).find("svg").css("opacity",1);
                })


                svgAvailability.calculateSvgAvailability();
                var unavailableSvgs = [];
                console.log(svgAvailability.allocatableSvgs);
                $.each(svgAvailability.allocatableSvgs, function(index, svg) {
                    if (!svgAvailability.isAvailable(svg)) 
                        unavailableSvgs.push(svg);
                });
                console.log(unavailableSvgs);
                $.each(unavailableSvgs, function(index, svg) {
                    $(svg).find('svg').css("opacity",".5");
                });
            },
            initializeSvgInformation: function () {
                svgAvailability.calculateSvgAvailability();

                $(svgAvailability.allocatableSvgs).each(function () {
                    var $this = $(this);
                    $this.on("click", function() {
                        svgAvailability.selectedSvg = this;
                        if (!svgAvailability.isAvailable(this)) {
                            Modal.createNormalModal(<h4 className="modal-title">Unassigned Resource</h4>,(
                                <div>
                                    <h5>This Resource is not assigned to Anyone.</h5>
                                    <p>Available to allocate</p>
                                </div>
                                ));
                        } else {
                            svgAvailability.openSelectedSvgDetails();
                        }
                    })
                });
            },
            "allocateSubmit": function(e) {
                e.stopPropagation();
                e.preventDefault();
                 var empId = Modal._modal().find("#allocate-emp-id").val();
                    if(!/^\d+$/.test(empId)) {
                        alert("Emp Id should be number only");
                        return false;
                    }
                    $(svgAvailability.selectedSvg).attr('data-allocated-id', empId);
                    svgAvailability.restoreOpacity();
                    Modal._modal().modal('hide');

                return false;
            },
            "deAllocateSubmit": function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                var empId = Modal._modal().find("#deallocate-emp-id").val();
                    if(!/^\d+$/.test(empId)) {
                        alert("Emp Id should be number only");
                        return false;
                    }
                    $(svgAvailability.selectedSvg).attr('data-allocated-id', "");
                    var file = Modal._modal().find("form #deallocate-approval").val(),
                        reason = Modal._modal().find("form #deallocate-reason").val();
                    svgAvailability.restoreOpacity();
                    Modal._modal().modal('hide');
                return false;
            },
            "openSelectedSvgDetails": function() {
                $("#loader").show();
                $.ajax({
                     type: 'POST',
                     headers  :{
                        'Content-Type': 'application/x-www-form-urlencoded'
                     },
                     // make sure you respect the same origin policy with this url:
                    // http://en.wikipedia.org/wiki/Same_origin_policy
                    url: 'http://localhost:8082/getEmployeeDetails.php',
                    data: { 
                        'action': 'getEmpDetails', 
                        'empId': $(svgAvailability.selectedSvg).attr('data-allocated-id')
                    },
                    success: function(msg){
                        $("#loader").hide();

                        var modalHeader= {},
                            modalBody= {};

                        if(!msg) {

                            modalHeader=  <h4 className="modal-title">Resource Associated to Unknown Person</h4>;
                            modalBody= <h5>We could not find the information for EmpID={$(svgAvailability.selectedSvg).attr('data-allocated-id')}</h5>;

                            } else {

                                modalHeader= <h4 className="modal-title">Resource Associated to {msg.emp_firstname + " " + msg.emp_lastname}</h4>;

                                msg = JSON.parse(msg)

                                var rows = [];
                                for(var i in msg)
                                {
                                    if(!msg[i]=="") //only show properties with available value
                                    rows.push(
                                        <tr key={i} >
                                            <td className="active">{i}</td>
                                            <td>{msg[i]}</td>
                                        </tr>);
                                }
                                modalBody= (
                                    <table className="table table-striped table-bordered table-hover">
                                        <tbody>
                                        {rows}
                                        </tbody>
                                    </table>
                                    );


                        }

                        Modal.createNormalModal(modalHeader, modalBody);
                    },
                    'error': function() {
                         $("#loader").hide();

                        Modal.createNormalModal(<h4>Error</h4>, <p>Error</p>);
                    }
                 })
            }

        }

        svgAvailability.initialize();

        var Modal= {
            'modalJSX': {},
            'createFormModal': function(headerJSX, bodyJSX, submitBtnName, cancelBtnName, submitCallback, cancelCallback) {
                var primaryBtn = {};
                Modal.modalJSX = (
                    <div data-modal-type="de-allocate" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={submitCallback}>
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        {headerJSX}
                                    </div>
                                    <div className="modal-body">
                                        {bodyJSX}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">{submitBtnName || 'Submit'}</button>
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={cancelCallback}>{cancelBtnName||'Close'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );

                Modal.showModal();
            },
            'createNormalModal': function(headerJSX, bodyJSX, primaryBtnName, cancelBtnName, primaryCallback, cancelCallback) {
                var primaryBtn = {};
                if (primaryCallback) {
                    primaryBtn = <button type="submit" className="btn btn-primary" onClick={primaryCallback}>{primaryBtnName || 'Submit'}</button>
                }
                Modal.modalJSX = (

                    <div data-modal-type="de-allocate" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={svgAvailability.allocateSubmit}>
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        {headerJSX}
                                    </div>
                                    
                                    <div className="modal-body">
                                        {bodyJSX}
                                    </div>
                                    <div className="modal-footer">
                                        {primaryCallback}
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={cancelCallback}>{cancelBtnName||'Close'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );

                Modal.showModal();
            },
            'showModal': function() {
                ReactDOM.render(Modal.modalJSX, document.querySelector('#modal'));
                $('#modal>div.modal').modal('show');
            },
            'closeModal': function() {
                $('#modal>div.modal').modal('hide');
            },
            '_modal': function() {
                return $("#modal>div.modal");
            }
        }

    })
 })()

export default SvgAvailability;

 