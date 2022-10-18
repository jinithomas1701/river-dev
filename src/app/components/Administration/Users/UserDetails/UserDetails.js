import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import {connect} from "react-redux";
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Chip from 'material-ui/Chip';
import moment from "moment";
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
// import {Cropper} from 'react-image-cropper'
// root component
import { Root } from "../../../Layout/Root";

// page dependencies
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import {Util} from "../../../../Util/util";
import { UserDetailsServices } from './UserDetails.service'
import {setField,
        setDepartmentsList,
        setDesignationsList,
        setLocationsList,
        setRolesList,
        setProjectsList,
        clearFormFields,
        loadUserDetails,
        changeUserImage,
        changeEmployeeTypeList} from "./UserDetails.actions";
import {SelectBox} from '../../../Common/SelectBox/SelectBox';

// CSS
import './UserDetails.scss'

// custom component
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';

const mapStateToProps = (state) => {
    return {
        userDetails: state.UserDetailsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadDesignationsList: (list) => {
            dispatch(setDesignationsList(list));
        },
        loadDepartmentsList: (list) => {
            dispatch(setDepartmentsList(list));
        },
        loadLocationsList: (list) => {
            dispatch(setLocationsList(list));
        },
        loadRolesList: (list) => {
            dispatch(setRolesList(list));
        },
        fieldChange: (fieldname, payload) => {
            dispatch(setField(fieldname, payload));
        },
        loadUserDetails: (user) => {
            dispatch(loadUserDetails(user));
        },
        clearFields: () => {
            dispatch(clearFormFields());
        },
        addUserImage: (image) => {
            dispatch(changeUserImage(image));
        },
        loadProjectsList: (list) => {
            dispatch(setProjectsList(list));
        },
        changeEmployeeTypeList: (employeeTypeList) => {
            dispatch(changeEmployeeTypeList(employeeTypeList));
        }
    }
};

const PRIVILEGE_UPDATE_USER = "UPDATE_USER";

class UserDetails extends React.Component {

    state = {
        avatar: '',
        emailInvalid: false,
        emailInvalidError: false,
        userUpdate: false,
        role: '',
        cropperOn: false,
        employeeTypeId: ""
    }

constructor(props){
    super(props);

    this.getLocations();
    this.getDepartments();
    this.getDesignations();
    // this.getProjects();
    this.getRoles();
    if (this.props.match.params.userId){
        this.getUserDetails(this.props.match.params.userId);
        this.state.userUpdate = true;
    } else {
        this.props.clearFields();
    }
}

componentDidMount(){
    this.loadEmployeeType();
}



render() {
    const genderList = [
        {
            title: 'Male',
            value: 'male'
        },
        {
            title: 'Female',
            value: 'female'
        }
    ];

    const selectedRolesChips = this.props.userDetails.userDetailsFields.roles.map((item, index) => {
        return <div key={index} className="chip-item-wrapper">
            <Chip
                className="chip-item"
                label={item.title}
                onRequestDelete={this.handleRemoveRole.bind(this, item)}
                />
        </div>
    });

    const clubName = this.props.userDetails.userDetailsFields.clubName;

    return (
        <Root role="admin">
            <MainContainer>
                <PageTitle title="User Details" />
                <div className="row user-details">

                    <div className="col-md-12">
                        <div className="content-container extra-margin-b">
                            <div className="page-title-section">
                                <div className="row justify-content-center">
                                    <div className="col-md-auto">
                                        <input accept="jpg,jpeg,JPG,JPEG" onChange={(e) => {
                                                this.onUserImageChange(e);
                                            }} id="user-image-input" type="file" />
                                        <label htmlFor="user-image-input">
                                            <a className="u_c-dp" >
                                                <img ref="user-image" src={this.state.avatar ? 
                                                        Util.getFullImageUrl(this.state.avatar) 
                                                    : "../../../../../resources/images/img/user-avatar.png"
                                                                          } className="u_c-dp-img" id="user-image"/>
                                                <p className="u_c-dp-change">Change</p>
                                            </a>
                                        </label>

                                    </div>
                                </div>
                            </div>
                            <div className="page-content-section">

                                <div className="section-title">Credential Details</div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="empId"
                                            label="Employee Id"
                                            required
                                            value = {this.props.userDetails.userDetailsFields.empId}
                                            className="input-field"
                                            margin="normal"
                                            onChange = {this.handleChange('empId')}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="email"
                                            label="Email"
                                            required
                                            error = {this.state.emailInvalid}
                                            helperText= {this.state.emailInvalidError}
                                            value = {this.props.userDetails.userDetailsFields.email}
                                            className="input-field"
                                            margin="normal"
                                            onChange = {this.handleChange('email')}
                                            onBlur={this.isEmailValid.bind(this)} 
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        {this.props.match.params.userId &&
                                            <Button raised
                                                color="primary"
                                                className="add-role-btn"
                                                onClick = {this.resetPassword.bind(this)}>RESET PASSWORD</Button>
                                        }

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <div className="input-field selectBox">
                                            <SelectBox 
                                                id="roles" 
                                                required
                                                label="Role*"
                                                selectedValue = {this.state.role}
                                                selectArray={this.props.userDetails.rolesList || []}
                                                onSelect={this.handleRoleSelect()}/>
                                        </div>                  
                                    </div>
                                    <div className="col-md-1 info-icon-holder">
                                        <IconButton color="primary" aria-label="Click to know role info" onClick={this.onInfoClick.bind(this)}>
                                            <Tooltip id="tooltip-icon" title={"Click to know role info"} placement="bottom">
                                                <Icon>info_outline</Icon>
                                            </Tooltip>
                                        </IconButton>
                                    </div>
                                    <div className="col-md-4 add-role-btn-container">
                                        <Button
                                            raised
                                            color="primary"
                                            className="add-role-btn"
                                            onClick = {this.addRoleHandle.bind(this)}
                                            >
                                            Add Role
                                        </Button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 role-chips-container">
                                        {selectedRolesChips}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        { this.getEmployeeTypeTemplate(this.props.userDetails.employeeTypeList) }
                                    </div>
                                </div>

                                <hr className="full-line"/>
                                <div className="section-title">Club Details</div>
                                <div className="row">
                                    <div className="col-md-4 input-container club-row">
                                        {(clubName) ? <TextField
                                                          label="Club Name"
                                                          className="input-field club-input"
                                                          value = {this.props.userDetails.userDetailsFields.clubName}
                                                          margin="normal"
                                                          onClick={this.onNavigateToClubDetails.bind(this)}
                                                          disabled
                                                          /> : <span className="noclub">Not Assigned to any Club</span>}
                                    </div>
                                </div>
                                <hr className="full-line"/>
                                <div className="section-title">Person Details</div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            required
                                            id="firstname"
                                            label="First Name"
                                            className="input-field"
                                            value = {this.props.userDetails.userDetailsFields.firstName}
                                            margin="normal"
                                            onChange = {this.handleChange('firstName')}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="middleName"
                                            label="Middle Name"
                                            value = {this.props.userDetails.userDetailsFields.middleName}
                                            className="input-field"
                                            margin="normal"
                                            onChange = {this.handleChange('middleName')}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="lastName"
                                            value = {this.props.userDetails.userDetailsFields.lastName}
                                            label="Last Name"
                                            className="input-field"
                                            margin="normal"
                                            onChange = {this.handleChange('lastName')}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <div className="input-field selectBox">
                                            <SelectBox 
                                                id="gender" 
                                                label="Gender" 
                                                selectedValue = {this.props.userDetails.userDetailsFields.gender}
                                                selectArray={genderList}
                                                onSelect={this.handleSelect('gender')}/>
                                        </div>                    
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="address"
                                            value = {this.props.userDetails.userDetailsFields.address}
                                            label="Address"
                                            className="input-field"
                                            margin="normal"
                                            onChange = {this.handleChange('address')}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="city"
                                            label="City"
                                            className="input-field"
                                            value = {this.props.userDetails.userDetailsFields.city}
                                            margin="normal"
                                            onChange = {this.handleChange('city')}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="state"
                                            label="State"
                                            className="input-field"
                                            value = {this.props.userDetails.userDetailsFields.state}
                                            margin="normal"
                                            onChange = {this.handleChange('state')}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="country"
                                            label="Country"
                                            className="input-field"
                                            value = {this.props.userDetails.userDetailsFields.country}
                                            margin="normal"
                                            onChange = {this.handleChange('country')}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="pincode"
                                            label="PinCode"
                                            className="input-field"
                                            margin="normal"
                                            value = {this.props.userDetails.userDetailsFields.pincode}
                                            type= "number"
                                            onChange = {this.handleChange('pincode')}
                                            />
                                    </div>
                                </div>
                                <hr className="full-line"/>
                                {/* <div className="section-title">Educational Details</div>
                                            <div className="row">
                                                <div className="col-md-4 input-container">
                                                    <TextField
                                                        id="degree"
                                                        label="Degree"
                                                        className="input-field"
                                                        value = {this.props.userDetails.userDetailsFields.degree}
                                                        margin="normal"
                                                        onChange = {this.handleChange('degree')}
                                                    />
                                                </div>
                                                <div className="col-md-4 input-container">
                                                    <TextField
                                                        id="college"
                                                        label="College"
                                                        className="input-field"
                                                        value = {this.props.userDetails.userDetailsFields.college}
                                                        margin="normal"
                                                        onChange = {this.handleChange('college')}
                                                    />
                                                </div>
                                                <div className="col-md-4 input-container">
                                                    <TextField
                                                        id="passYear"
                                                        label="Year Of Passing"
                                                        className="input-field"
                                                        value = {this.props.userDetails.userDetailsFields.passYear}
                                                        margin="normal"
                                                        type="number"
                                                        min={1998}
                                                        max={2017}
                                                        onChange = {this.handleChange('passYear')}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </div>
                                            </div> */}

                                <hr className="full-line"/>
                                <div className="section-title">Professional Details</div>
                                <div className="row">
                                    {/* <div className="col-md-4 input-container">
                                                <TextField
                                                    id="experience"
                                                    label="Years Of Experience"
                                                    value = {this.props.userDetails.userDetailsFields.experience}
                                                    className="input-field"
                                                    margin="normal"
                                                    type= "number"
                                                    onChange = {this.handleChange('experience')}
                                                />
                                            </div> */}
                                    <div className="col-md-4 input-container">
                                        <div className="input-field selectBox">
                                            <SelectBox 
                                                id="baseLocation" 
                                                label="Base Location*" 
                                                selectedValue = {this.props.userDetails.userDetailsFields.baseLocation}
                                                selectArray={this.props.userDetails.locationsList || []}
                                                onSelect={this.handleSelect('baseLocation')}/>
                                        </div>                    
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <div className="input-field selectBox">
                                            <SelectBox 
                                                id="currentLocation" 
                                                label="Current Location*" 
                                                selectedValue = {this.props.userDetails.userDetailsFields.currentLocation}
                                                selectArray={this.props.userDetails.locationsList || []}
                                                onSelect={this.handleSelect('currentLocation')}/>
                                        </div>                    
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="dateofjoin"
                                            label="Date Of Join*"
                                            className="input-field"
                                            margin="normal"
                                            value = {this.props.userDetails.userDetailsFields.dateofjoin}
                                            type="date"
                                            onChange = {this.handleChange('dateofjoin')}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <div className="input-field selectBox">
                                            <SelectBox 
                                                id="department" 
                                                label="Department*" 
                                                selectedValue = {this.props.userDetails.userDetailsFields.department}
                                                selectArray={this.props.userDetails.departmentsList || []}
                                                onSelect={this.handleSelect('department')}/>
                                        </div>                        
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <div className="input-field selectBox">
                                            <SelectBox 
                                                id="designation" 
                                                label="Designation*" 
                                                selectedValue = {this.props.userDetails.userDetailsFields.designation}
                                                selectArray={this.props.userDetails.designationsList || []}
                                                onSelect={this.handleSelect('designation')}/>
                                        </div>                        
                                    </div>
                                    {/* <div className="col-md-4 input-container">
                                                    <div className="input-field selectBox">
                                                        <SelectBox 
                                                            id="projects" 
                                                            label="Project*" 
                                                            selectedValue = {this.props.userDetails.userDetailsFields.projectName}
                                                            selectArray={this.props.userDetails.projectsList || []}
                                                            onSelect={this.handleSelect('projectName')}/>
                                                    </div>
                                                </div> */}
                                    {/* <div className="col-md-4 input-container">
                                                    <TextField
                                                        id="projectName"
                                                        label="Project"
                                                        value = {this.props.userDetails.userDetailsFields.projectname}
                                                        className="input-field"
                                                        margin="normal"
                                                        onChange = {this.handleChange('projectName')}
                                                    />
                                                </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="floating-bottom-control">
                            {Util.hasPrivilage(PRIVILEGE_UPDATE_USER) &&
                                <div>
                                    <Button
                                        onClick = {this.onCancel.bind(this)}
                                        >
                                        Cancel
                                    </Button>
                                    {
                                        this.state.userUpdate ? (
                                            <Button 
                                                color="primary"
                                                onClick = {this.updateUser.bind(this)}
                                                >
                                                Update
                                            </Button>
                                        ) : (
                                            <Button 
                                                color="primary"
                                                onClick = {this.addUser.bind(this)}
                                                >
                                                Save
                                            </Button>                                            
                                        )

                                    }
                                </div>
                            }
                            {!Util.hasPrivilage(PRIVILEGE_UPDATE_USER) &&
                                <div>
                                    <Button
                                        onClick = {this.onCancel.bind(this)}
                                        >
                                        OK
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </MainContainer>
        </Root>
    );
}

getEmployeeTypeTemplate(employeeTypes){
    let template = null;
    if(employeeTypes.length){
        template = <RadioGroup
                       aria-label="Employee TYpe"
                       name="employeeTypeId"
                       className="input-employeetype"
                       value={this.state.employeeTypeId}
                       onChange={this.handleRadioChange}
                       >
                {
                    employeeTypes.map(type => {
                        return (<FormControlLabel key={type.value} className="input-emp-radio" value={type.value} control={<Radio />} label={type.title} />);
                    })
                }
            </RadioGroup>
    }

    return template;
}

onNavigateToClubDetails(){
    const clubId = this.props.userDetails.userDetailsFields.clubId;
    this.props.history.push(`/admin/clubs/detail/${clubId}`);
}

onInfoClick() {
    this.props.history.push("/admin/roles");
}

handleRadioChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
}

handleChange = name => event => {
    this.props.fieldChange(name, event.target.value);
};

handleSelect = name => value => {
    this.props.fieldChange(name, value);
}

handleRoleSelect = name => value => {
    this.setState( {role: value});
}

handleRemoveRole = (name) => {
    var rolesList = this.props.userDetails.userDetailsFields.roles;

    rolesList = rolesList.filter(role => { return (role.id != name.id) ? role : false});

    this.props.fieldChange("roles", rolesList);
}

resetPassword() {
    if (confirm("Are you sure ?")) {
        UserDetailsServices.resetPassword(this.props.match.params.userId)
            .then(data => {
            riverToast.show("A new password has been sent to the user email.");
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while resetting password.");
        })
    }
}

addRoleHandle() {
    var rolesList = this.props.userDetails.userDetailsFields.roles;
    const selectedRole = this.state.role;

    if(selectedRole){
        if(rolesList.length > 0){
            if(!rolesList.includes(selectedRole)){
                rolesList.push(selectedRole);
                this.props.fieldChange("roles", rolesList);
            } else {
                riverToast.show( '"' + selectedRole.name + '"' + ' already assigned');
            }
        } else {
            rolesList.push(selectedRole);
            this.props.fieldChange("roles", rolesList);
        }
    } else {
        riverToast.show("Please select any role from list")
    }
}

onCancel() {
    this.props.history.push("/admin/users");       
}

isEmailValid(){
    if(!/[\w._]+(@litmus7.com | @retailsingularity.com)$/.test(this.props.userDetails.userDetailsFields.email)){
        this.setState({ 
            emailInvalidError: "Please enter valid email (must be litmus7.com or retailsingularity.com)",
            emailInvalid: true
        });
    } else {
        this.setState({ 
            emailInvalidError: false,
            emailInvalid: false
        });
    }
}

autoGeneratePassword(){
    this.props.fieldChange('password', "");
    let empId = this.props.userDetails.userDetailsFields.empId;
    let email = this.props.userDetails.userDetailsFields.email;
    if(!empId) {
        riverToast.show("Please enter Employee Id");
    } else if(!email) {
        riverToast.show("Please enter Email");            
    } else {
        if(/[\w\d._]+@litmus7.com$/.test(email)){
            const password = '#' + empId + email.match(/[\w\d._]+(?=@)/);
            this.props.fieldChange('password', password);
        } else {
            riverToast.show("Only emails of litmus7.com accepted.");
            riverToast.show("Please check the email entered.");
        }
    }
}

onUserImageChange(event) {
    const imageFile = event.target.files[0];
    this.props.addUserImage(imageFile);
    Util.displayImageFromFile(imageFile, "user-image");
    Util.base64ImageFromFile(imageFile).
    then( result => {
        this.props.fieldChange("avatar", result);

        // this.setState({avatar: this.refs["user-image"].src,cropperOn: true});

    }).
    catch(error => {
        riverToast.show(error.status_message || "Something went wrong while changing image");                        
    });

}



onCropImage() {
}

isFormValid(){
    const fieldValues = this.props.userDetails.userDetailsFields;
    if(
        !fieldValues.empId || 
        !fieldValues.email ||
        !fieldValues.roles.length > 0 ||
        !fieldValues.firstName ||
        !fieldValues.baseLocation ||
        !fieldValues.currentLocation ||
        !fieldValues.department ||
        !fieldValues.designation ||
        !fieldValues.dateofjoin ||
        !this.state.employeeTypeId
    ){
        return false;
    }
    return true;
}

selectBoxList(list) {
    return list.map((item) => {
        return { title: item.name, value: item.id }
    })
}

getDepartments = () => {
    UserDetailsServices.getDepartments().
    then((data) => {
        if(data){
            var list = data.map((item) => {
                return { title: item.name, value: item.id }
            })
            this.props.loadDepartmentsList(list);
        }
    }).
    catch((error) => {
        riverToast.show(error.status_message || "Something went wrong whle fetching departments");            
    })
}

getDesignations = () => {
    UserDetailsServices.getDesignations().
    then((data) => {
        if(data){
            var list = data.map((item) => {
                return { title: item.name, value: item.id }
            })
            this.props.loadDesignationsList(list);                
        }
    }).
    catch((error) => {
        riverToast.show(error.status_message || "Something went wrong whle fetching designations");            
    })
}

getProjects = () => {
    UserDetailsServices.getProjects().
    then((data) => {
        if(data){
            var list = data.map((item) => {
                return { title: item.name, value: item.id }
            })
            this.props.loadProjectsList(list);                
        }
    }).
    catch((error) => {
        riverToast.show(error.status_message || "Something went wrong whle fetching projects");                        
    })
}

getLocations = () => {
    UserDetailsServices.getLocations().
    then((data) => {
        if(data){
            var list = data.map((item) => {
                return { title: item.name, value: item.id }
            })
            this.props.loadLocationsList(list);                           
        }
    }).
    catch((error) => {
        riverToast.show(error.status_message || "Something went wrong whle fetching locations");            
    })
}

getRoles = () => {
    UserDetailsServices.getRoles().
    then((data) => {
        if(data){
            var list = data.map((item) => {
                return { title: item.title, value: { name: item.name, id: item.id, title: item.title} }
            })
            this.props.loadRolesList(list);
            if(list.length > 0) {
                this.setState({ role: list[0].value });
            }                   
        }
    }).
    catch((error) => {
        riverToast.show(error.status_message || "Something went wrong whle fetching roles");            
    })
}

getUserDetails = (userId) => {
    UserDetailsServices.getUserDetails(userId).
    then((data) => {
        if(data){
            var userMeta = this.userDetailsJSON(data);
            this.props.loadUserDetails(userMeta);
            this.setState({avatar : data.avatar, employeeTypeId: data.employeeType.code });
        }
    }).
    catch((error) => {
        riverToast.show(error.status_message || "Something went wrong whle fetching user details");
    })
}

userDetailsJSON(user){
    return {
        currentLocation: user.currentLocation ? user.currentLocation.id : "",
        baseLocation: user.baseLocation ? user.baseLocation.id : "",
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        gender : user.gender,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
        degree: user.degree,
        college: user.college,
        passYear: user.passYear,
        experience: user.experience,
        dateofjoin: moment.unix(user.dateofjoin/1000).format("YYYY-MM-DD"),
        projectName: user.projectName ? (user.projectName.id || '') : '',
        department: user.department ? (user.department.id || '') : '',
        designation: user.designation ? (user.designation.id || '') : '',
        email: user.email,
        empId: user.empId,
        roles: user.roles ? (user.roles || [] ): [],
        clubId: user.clubId,
        clubName: user.clubName
    }
}

addUser(){
    if (this.isFormValid()){
        const user = {
            avatar: this.props.userDetails.userDetailsFields.avatar,
            firstName: this.props.userDetails.userDetailsFields.firstName,
            middleName: this.props.userDetails.userDetailsFields.middleName,
            lastName: this.props.userDetails.userDetailsFields.lastName,
            gender: this.props.userDetails.userDetailsFields.gender,
            address: this.props.userDetails.userDetailsFields.address,
            city: this.props.userDetails.userDetailsFields.city,
            state: this.props.userDetails.userDetailsFields.state,
            country: this.props.userDetails.userDetailsFields.country,
            pincode: this.props.userDetails.userDetailsFields.pincode,
            degree: this.props.userDetails.userDetailsFields.degree,
            college: this.props.userDetails.userDetailsFields.college,
            passYear: this.props.userDetails.userDetailsFields.passYear,
            experience: this.props.userDetails.userDetailsFields.experience,
            department: { id: this.props.userDetails.userDetailsFields.department},
            designation: { id: this.props.userDetails.userDetailsFields.designation},
            baseLocation: { id : this.props.userDetails.userDetailsFields.baseLocation},
            currentLocation: { id : this.props.userDetails.userDetailsFields.currentLocation},
            dateofjoin: this.props.userDetails.userDetailsFields.dateofjoin,
            projectname: { id : this.props.userDetails.userDetailsFields.projectName},
            email: this.props.userDetails.userDetailsFields.email,
            // password: this.props.userDetails.userDetailsFields.password,
            empId: this.props.userDetails.userDetailsFields.empId,
            roles : this.props.userDetails.userDetailsFields.roles,
            employeeType: this.state.employeeTypeId
        }
        UserDetailsServices.addUser(user).
        then((data) => {
            this.props.clearFields();
            this.props.history.push("/admin/users");
            riverToast.show("User created successfully");
        }).
        catch((error) => {
            riverToast.show(error.status_message || "Error in network");                
        });

    } else {
        riverToast.show("Please fill all required fields")
    }
}

updateUser() {
    if (this.isFormValid()){
        const user = {
            avatar: this.props.userDetails.userDetailsFields.avatar,
            firstName: this.props.userDetails.userDetailsFields.firstName,
            middleName: this.props.userDetails.userDetailsFields.middleName,
            lastName: this.props.userDetails.userDetailsFields.lastName,
            gender: this.props.userDetails.userDetailsFields.gender,
            address: this.props.userDetails.userDetailsFields.address,
            city: this.props.userDetails.userDetailsFields.city,
            state: this.props.userDetails.userDetailsFields.state,
            country: this.props.userDetails.userDetailsFields.country,
            pincode: this.props.userDetails.userDetailsFields.pincode,
            degree: this.props.userDetails.userDetailsFields.degree,
            college: this.props.userDetails.userDetailsFields.college,
            passYear: this.props.userDetails.userDetailsFields.passYear,
            experience: this.props.userDetails.userDetailsFields.experience,
            department: { id: this.props.userDetails.userDetailsFields.department},
            designation: { id: this.props.userDetails.userDetailsFields.designation},
            baseLocation: { id : this.props.userDetails.userDetailsFields.baseLocation},
            currentLocation: { id : this.props.userDetails.userDetailsFields.currentLocation},
            dateofjoin: this.props.userDetails.userDetailsFields.dateofjoin,
            projectname: { id : this.props.userDetails.userDetailsFields.projectName },
            email: this.props.userDetails.userDetailsFields.email,
            password: this.props.userDetails.userDetailsFields.password,
            empId: this.props.userDetails.userDetailsFields.empId,
            roles : this.props.userDetails.userDetailsFields.roles,
            employeeType: this.state.employeeTypeId
        }
        UserDetailsServices.updateUser(user, this.props.match.params.userId).
        then((data) => {
            this.props.clearFields();
            this.props.history.push("/admin/users");
            riverToast.show("User updated successfully");
        }).
        catch((error) => {
            riverToast.show(error.status_message || "Error in network");                
        });

    } else {
        riverToast.show("Please fill all required fields")
    }
}
loadEmployeeType(){
    UserDetailsServices.getEmployeeType()
        .then(data => {
        const employeeTypes = data.map(type => ({title: type.label, value: type.code}));
        this.props.changeEmployeeTypeList(employeeTypes);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while loading Employee type in User");                
    });
}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);