import React from 'react';

function Dashboard() {
  return (
    <section className='dashboard section'>
        <div className='row'>
            <div className='col-lg-8'>
                <div className='row'>
                    <h1>Dashboard</h1>
                </div>
            </div>
            <div className='col-lg-4'></div>
            
            <div class="table-responsive">
                  <table class="table table-centered table-striped dt-responsive nowrap w-100" id="products-datatable">
                      <thead>
                          <tr>
                              <th style={{width: "20px"}}>
                                  <div class="custom-control custom-checkbox">
                                      <input type="checkbox" class="custom-control-input" id="customCheck1"/>
                                      <label class="custom-control-label" for="customCheck1">&nbsp;</label>
                                  </div>
                              </th>
                                                        <th>Username</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Last Activity</th>
                                                        <th>Status</th>
                                                        <th style={{width: "75px;"}}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div class="custom-control custom-checkbox">
                                                                <input type="checkbox" class="custom-control-input" id="customCheck2"/>
                                                                <label class="custom-control-label" for="customCheck2">ABC</label>
                                                            </div>
                                                        </td>
                                                        <td class="table-user">
                                                            <img src="../assets/images/users/user-4.jpg" alt="table-user" class="mr-2 rounded-circle"/>
                                                            <a href="" class="text-body font-weight-semibold">Paul J. Friend</a>
                                                        </td>
                                                        <td>050 414 8778</td>
                                                        <td>
                                                            $12,874.82
                                                        </td>
                                                        <td>
                                                            August 05 2019 <small class="text-muted">10:29 PM</small>
                                                        </td>
                                                        <td>
                                                            <span class="badge badge-soft-success">Active</span>
                                                        </td>
                    
                                                        <td>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                                                        </td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        <td>
                                                            <div class="custom-control custom-checkbox">
                                                                <input type="checkbox" class="custom-control-input" id="customCheck3"/>
                                                                <label class="custom-control-label" for="customCheck3">&nbsp;</label>
                                                            </div>
                                                        </td>
                                                        <td class="table-user">
                                                            <img src="../assets/images/users/user-3.jpg" alt="table-user" class="mr-2 rounded-circle"/>
                                                            <a href="" class="text-body font-weight-semibold">Bryan J. Luellen</a>
                                                        </td>
                                                        <td>
                                                            215-302-3376
                                                        </td>
                                                        <td>
                                                            $874.25
                                                        </td>
                                                        <td>August 04 2019 <small class="text-muted">08:18 AM</small></td>
                                                        <td>
                                                            <span class="badge badge-soft-success">Active</span>
                                                        </td>
                    
                                                        <td>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="custom-control custom-checkbox">
                                                                <input type="checkbox" class="custom-control-input" id="customCheck4"/>
                                                                <label class="custom-control-label" for="customCheck4">&nbsp;</label>
                                                            </div>
                                                        </td>
                                                        <td class="table-user">
                                                            <img src="../assets/images/users/user-3.jpg" alt="table-user" class="mr-2 rounded-circle"/>
                                                            <a href="" class="text-body font-weight-semibold">Kathryn S. Collier</a>
                                                        </td>
                                                        <td>
                                                            828-216-2190
                                                        </td>
                                                        <td>
                                                            $125.78
                                                        </td>
                                                        <td>November 04 2019 <small class="text-muted">10:29 PM</small></td>
                                                        <td>
                                                            <span class="badge badge-soft-danger">Blocked</span>
                                                        </td>
                    
                                                        <td>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="custom-control custom-checkbox">
                                                                <input type="checkbox" class="custom-control-input" id="customCheck5"/>
                                                                <label class="custom-control-label" for="customCheck5">&nbsp;</label>
                                                            </div>
                                                        </td>
                                                        <td class="table-user">
                                                            <img src="../assets/images/users/user-1.jpg" alt="table-user" class="mr-2 rounded-circle"/>
                                                            <a href="" class="text-body font-weight-semibold">Timothy Kauper</a>
                                                        </td>
                                                        <td>
                                                            (216) 75 612 706
                                                        </td>
                                                        <td>
                                                            $561.25
                                                        </td>
                                                        <td>February 01 2019 <small class="text-muted">07:22 AM</small></td>
                                                        <td>
                                                            <span class="badge badge-soft-danger">Blocked</span>
                                                        </td>
                    
                                                        <td>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                            <a href="" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
        </div>
    </section>
  )
}

export default Dashboard