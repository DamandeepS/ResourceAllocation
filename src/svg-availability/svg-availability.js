import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './svg-availability.css';
import $ from 'jquery';
import "./bootstrap.js"

var container = (
    <div className="main-container">
    <div className="svg-container" data-allocatable="true" data-allocated-id="">
        <svg width="260px" height="210px">
            <polygon points="200,10 250,190 160,210" style={{'fill':"#c5f",'stroke':"rgb(123,12,43)",'strokeWidth':'1'}} > </polygon>
        </svg>
    </div>
    <div className="svg-container" data-allocatable="true" data-allocated-id="">
        <svg width="260px" height="210px">
            <polygon points="200,10 250,190 160,210" style={{'fill':"#c5f",'stroke':"rgb(123,12,43)",'strokeWidth':'1'}} > </polygon>
        </svg>
    </div>
    <div className="svg-container" data-allocatable="true" data-allocated-id="">
        <svg width="260px" height="210px">
            <polygon points="200,10 250,190 160,210" style={{'fill':"#c5f",'stroke':"rgb(123,12,43)",'strokeWidth':'1'}} > </polygon>
        </svg>
    </div>
    <div className="svg-container" data-allocatable="true" data-allocated-id="1361">
        <svg width="100px" height="100px">
            <rect x="0" y="0" rx="20" ry="20" width="100%" height="100%" style={{'fill':'red','stroke':'rgb(123,12,43)','strokeWidth':'1'}}></rect>
        </svg>
    </div>
    <div className="svg-container" data-allocatable="false" data-allocated-id="">
        <svg width="100px" height="100px">
            <rect x="0" y="0" rx="20" ry="20" width="100%" height="100%" style={{'fill':'red','stroke':'rgb(123,12,43)','strokeWidth':'1'}}> </rect>        </svg>
    </div>
    <div className="controls">
        <input type="button" id="availability" className="btn btn-default" value="Show Availability"></input>
    </div>
    <div id="allocateModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
            <div className="modal-content">
                <form>
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Allocate</h4>
                    </div>
                    <div className="modal-body">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Emp Id*</span>
                            <input type="text" id="allocate-emp-id" placeholder="example: 1001" name="allocate-emp-id" className="form-control" aria-describedby="basic-addon1" required></input>
                        </div>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon2">Comments</span>
                            <input id="allocate-comments" aria-describedby="basic-addon2" className="form-control" ></input>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">Allocate</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div id="deAllocateModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
            <div className="modal-content">
                <form>
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">De-allocate</h4>
                    </div>
                    <div className="modal-body">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Assigned To</span>
                            <input readOnly type="text" id="deallocate-emp-id" placeholder="example: 1001" name="deallocate-emp-id" className="form-control" aria-describedby="basic-addon1" required></input>
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
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">De-Allocate</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>);

class SvgAvailability extends Component {
  render() {
    return container;
  }
}

 (function() {
    $(document).ready(function() {
        // alert();

        var svgAvailability = {
            'showAvailable': false,
            'selectedSvg': null,
            'allocatableSvgs': [],
            'isAvailable': function (svgParent) {
                return ($(svgParent).attr("data-allocated-id").toString()!="");

            },
            'calculateSvgAvailability': function() {
                svgAvailability.allocatableSvgs = $(".main-container > .svg-container[data-allocatable='true']");
            },
            'addEditor': function() {
                svgAvailability.calculateSvgAvailability();
                $.each(svgAvailability.allocatableSvgs, function(index, svgParent) {
                    var edit = document.createElement("button");
                    edit.classList = "edit";
                    edit = $(edit);
                    // edit.attr("data-toggle","modal");
                        // if (svgAvailability.isAvailable(svgParent)) {
                        //  edit.attr("data-target", "#allocateModal");
                        // } else
                        //  edit.attr("data-target", "#deAllocateModal");

                    edit.on("click", function () {
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
                            var opacity = "1";
                            if (svgAvailability.showAvailable) {
                                svgAvailability.addEditor();
                                opacity = "0.5";
                                
                            } else {
                                opacity = "1";
                                svgAvailability.removeEditor();
                            }

                console.log(unavailableSvgs);
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

                var allocateModal = $("#allocateModal"),
                    deAllocateModal = $("#deAllocateModal");
                allocateModal.find("form").on('submit', function (e) {
                        e.preventDefault();
                    var empId = allocateModal.find("#allocate-emp-id").val();
                    if(!/^\d+$/.test(empId)) {
                        alert("Emp Id should be number only");
                        return false;
                    }
                    $(svgAvailability.selectedSvg).attr('data-allocated-id', empId);
                    svgAvailability.restoreOpacity();
                    allocateModal.modal('hide');
                    return false;
                })
                deAllocateModal.find("form").on('submit', function (e) {
                    e.preventDefault();
                    var empId = deAllocateModal.find("#deallocate-emp-id").val();
                    if(!/^\d+$/.test(empId)) {
                        alert("Emp Id should be number only");
                        return false;
                    }
                    $(svgAvailability.selectedSvg).attr('data-allocated-id', "");
                    var file = deAllocateModal.find("form #deallocate-approval").val(),
                        reason = deAllocateModal.find("form #deallocate-reason").val();
                    console.log(file, reason);
                    svgAvailability.restoreOpacity();
                    deAllocateModal.modal('hide');
                    return false;

                })
            },
            allocate: function(customEvent) {
                svgAvailability.selectedSvg = customEvent.detail.callerSvg;
                $("#allocateModal").modal('show');
            },
            deAllocate: function (customEvent) {
                svgAvailability.selectedSvg = customEvent.detail.callerSvg;
                console.log(svgAvailability.selectedSvg, $(svgAvailability.selectedSvg).data("allocated-id"), $("#deAllocateModal > #deallocate-emp-id"));
                $("#deAllocateModal #deallocate-emp-id").val($(svgAvailability.selectedSvg).data("allocated-id"));
                $("#deAllocateModal").modal('show');
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
                var notAssigned = ( 
                                    <div id="notAssignedModal" className="modal fade" role="dialog">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                    <div className="modal-header">
                                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                        <h4 className="modal-title">Unassigned Resource</h4>
                                                    </div>
                                                    <div className="modal-body">
                                                        <h5>This Resource is not assigned to Anyone.</h5>
                                                        <p>Available</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                );

                // ReactDOM.render(notAssigned, $('.main-container')[0])

                $(svgAvailability.allocatableSvgs).each(function () {
                    var $this = $(this);
                    $this.on("click", function() {
                        if (svgAvailability.isAvailable(this)) {

                        } else {
                            $(".main-container #notAssignedModal").modal("show")
                        }
                    })
                }) ///-----------------///
            },
            showInfoForSVG:function(e) {

            }
        }

        svgAvailability.initialize();

    })
 })()

export default SvgAvailability;

 