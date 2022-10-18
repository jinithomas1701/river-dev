import { ApiUrlConstant } from "./apiUrl.constant";
import moment from 'moment';
import FileSaver from "file-saver";

export class Util {
    headerContext = null;
    toastContext = null;
    sideMenuContext = null;
    sideMenuWidth = null;

    static setSidemenuContext(context) {
        this.sideMenuContext = context;
    }

    static getSidemenuContext() {
        return this.sideMenuContext;
    }

    static getSidemenuWidth() {
        return this.sideMenuWidth || "14rem";
    }

    static getActivityStatusList(role = "All") {
        let list;
        switch (role) {
            case "ROLE_RIVER_COUNCIL":
                list = [
                    { "code": "PA", "label": "President Approval", "order": 3 },
                    { "code": "LA", "label": "Panel Approval", "order": 4 },
                    { "code": "LR", "label": "Panel Rejected", "order": 4 },
                    { "code": "PC", "label": "Point Credited", "order": 5 }
                ];
                break;
            default:
                list = [
                    { "code": "A", "label": "Activity Assigned", "order": 1 },
                    { "code": "C", "label": "User Completed", "order": 2 },
                    { "code": "PA", "label": "President Approval", "order": 3 },
                    { "code": "PR", "label": "President Rejected", "order": 3 },
                    { "code": "LA", "label": "Panel Approval", "order": 4 },
                    { "code": "LR", "label": "Panel Rejected", "order": 4 },
                    { "code": "PC", "label": "Point Credited", "order": 5 }
                ];
                break;
        }
        return list;
    }

    static toggleSidemenu() {
        if (this.sideMenuContext) {
            if (this.sideMenuContext.state.width === "14rem") {
                this.sideMenuWidth = "3.3rem";
            } else {
                this.sideMenuWidth = "14rem";
            }
            this.sideMenuContext.setState({ width: this.sideMenuWidth });
        }
    }

    static setHeaderContext(context) {
        this.headerContext = context;
    }

    static getHeaderContext(context) {
        return this.headerContext;
    }

    static toggleHeaderLoader(value) {
        if (this.headerContext) {
            this.headerContext.setState({ showLoader: value });
        }
    }

    static setToastContext(context) {
        // if (!this.toastContext) {
        this.toastContext = context;
        // }
    }

    static getToastContext(context) {
        return this.toastContext;
    }

    static validateImageFiles(files) {
        let isValid = true;
        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file && (file.type != "image/png" && file.type != "image/jpg" && file.type != "image/jpeg")) {
                    isValid = false;
                }
            }, this);
        } else {
            isValid = false
        }

        return isValid;
    }

    static beautifyUrl(urlString, params) {
        for (let value of params) {
            urlString = urlString.replace('{?}', value);
        }

        return urlString;
    }

    static getFullImageUrl(imageId, isThumb = true) {
        let imageUrl = ApiUrlConstant.BASE_URL + "image/";
        if (isThumb) {
            imageUrl = imageUrl + "thumb/";
        }

        return imageUrl + imageId
    }

    static setRandomBannerClose() {
        this.setBannerStatus("inactive");
        this.setTs("_banner_close_time_threshold");
    }

    static setBannerStatus(status) {
        localStorage.setItem("_banner_close_status", status);
        if (status == "active") {
            this.clearBannerTs();
        }
    }

    static setTs(fieldName) {
        localStorage.setItem(fieldName, new Date(Date.now() + 86400 * 1000).getTime());
    }

    static getBannerCloseTs() {
        return localStorage.getItem("_banner_close_time_threshold");
    }

    static getBannerStatus() {
        return localStorage.getItem("_banner_close_status");
    }

    static clearBannerTs() {
        localStorage.removeItem("_banner_close_time_threshold");
    }

    static base64ImageFromFile(imageFile, withType = false) {
        let imageConversinoPromise;
        if (FileReader && imageFile) {
            var fr = new FileReader();
            imageConversinoPromise = new Promise((resolve, reject) => {
                fr.onload = () => {
                    if (withType) {
                        resolve(fr.result);
                    } else {
                        resolve(fr.result.split(",")[1]);
                    }
                }
                fr.readAsDataURL(imageFile);
            });
        }

        return imageConversinoPromise;
    }


    static getActivityLinkDetails() {
        return JSON.parse(localStorage.getItem("__ACTIVITY_LINK_DETAILS"));
    }

    static setActivityLinkDetails(linkDetails) {
        return localStorage.setItem("__ACTIVITY_LINK_DETAILS", JSON.stringify(linkDetails));
    }

    static getLoggedInUserDetails() {
        return JSON.parse(localStorage.getItem("__LOGGEDIN_USER_DETAILS"));
    }

    static setLoggedInUserDetails(userDetails) {
        return localStorage.setItem("__LOGGEDIN_USER_DETAILS", JSON.stringify(userDetails));
    }

    static getActiveRole() {
        const me = this.getLoggedInUserDetails();
        return me.activeRole;
    }

    static setActiveRole(role) {
        return localStorage.setItem("__LOGGEDIN_USER_ACTIVE_ROLE", JSON.stringify(role));
    }

    static getPrivilages() {
        return JSON.parse(localStorage.getItem("__LOGGEDIN_USER_PRIVILAGES"));
    }

    static setPrivilages(privilages) {
        return localStorage.setItem("__LOGGEDIN_USER_PRIVILAGES", JSON.stringify(privilages));
    }

    static clearLoggedInUserData() {
        localStorage.setItem("__LOGGEDIN_USER_DETAILS", null);
        localStorage.setItem("accessToken", null);
        localStorage.setItem("last_login", null);
    }

    static getMyClubDetails() {
        const me = this.getLoggedInUserDetails();
        return me.myClub;
    }

    static getAuthToken() {
        return localStorage.getItem("accessToken");
    }

    static displayImageFromFile(imageFile, imagePlaceholderId) {
        if (FileReader && imageFile) {
            var fr = new FileReader();
            fr.onload = () => {
                if (document.getElementById(imagePlaceholderId)) {
                    document.getElementById(imagePlaceholderId).src = fr.result;
                }
            }
            fr.readAsDataURL(imageFile);
        }
    }

    static getCurrentFinancialYear() {
        var dt = new Date();
        return dt.getMonth() < 3 ? dt.getFullYear() - 1 : dt.getFullYear();
    }

    static getDateInFormat(timestamp, formatString) {
        return moment.unix(timestamp / 1000).format(formatString);
    }

    static getDateStringFromTimestamp(timestamp) {
        // 2017-11-08T22:02
        return moment.unix(timestamp / 1000).format("YYYY-MM-DD hh:mm A");
    }

    static getIndexOfItem(list, key, value) {
        let selectedIndex = -1;
        list.forEach(function (element, index) {
            if (element[key] === value) {
                selectedIndex = index;
            }
        }, this);
        return selectedIndex;
    }

    static logOut() {
        if (confirm("Are you sure about logging out?")) {
            this.clearLoggedInUserData();
            window.location.href = "/login";
        }
    }

    static hasPrivilage(privilage) {
        let hasPrivilage = true;
        if (privilage) {
            if (Util.getLoggedInUserDetails()) {
                const userPrivilages = Util.getLoggedInUserDetails().currentPrivileges;
                hasPrivilage = userPrivilages.indexOf(privilage) < 0 ? false : true;
            }
        }
        return hasPrivilage;
    }

    static isLoggedIn() {
        var authToken = this.getAuthToken();
        return (authToken == null || authToken == "null") ? false : true;
    }

    static downloadMimeTypeFile(base64, filename, mimeType) {
        // var element = document.createElement('a');
        // element.setAttribute('href', 'data:application/octet-stream;base64,' + base64);
        // element.setAttribute('download', 'report.pdf');

        // element.style.display = 'none';
        // document.body.appendChild(element);

        // element.click();

        // document.body.removeChild(element);
        fetch("data:" + mimeType + ";base64," + base64)
            .then(function (resp) { return resp.blob() })
            .then(function (blob) {
                FileSaver.saveAs(blob, filename);
            });
    }

    static downloadFile(base64, filename, format) {
        // var element = document.createElement('a');
        // element.setAttribute('href', 'data:application/octet-stream;base64,' + base64);
        // element.setAttribute('download', 'report.pdf');

        // element.style.display = 'none';
        // document.body.appendChild(element);

        // element.click();

        // document.body.removeChild(element);
        fetch("data:application/" + format + ";base64," + base64)
            .then(function (resp) { return resp.blob() })
            .then(function (blob) {
                FileSaver.saveAs(blob, filename + "." + format);
            });
    }

    static getRedirectPath(role) {
        switch (role) {
            case "ROLE_RIVER_COUNCIL":
                return "#/admin/councilDash";
            case "ROLE_CLUB_PRESIDENT":
                return "#/admin/clubDash";
            case "ROLE_CEO":
                return "#/admin/ceoDash"
            case "ROLE_SUPER_ADMIN":
                return "#/admin";
            case "ROLE_CLUB_CLIENT":
                return "#/litup";
            case "ROLE_RIVER":
                return "#/admin/riverDash";
            case "ROLE_CLUB_TREASURER":
                return "#/club-treasurer/treasurerDash";
            case "ROLE_CFO":
                return "#/cfo/cfoDash";
            default:
                return "#/dashboard"
                break;
        }
    }
    static getImage(avatar, context = "club") {
        let avatarImage = avatar ? (Util.getFullImageUrl(avatar) + `?${Date.now()}`) : `/resources/images/img/${context}.png`;
        return avatarImage;
    }
    static beautifyDate(_date) {
        const date = moment(_date)
        const today = new moment();
        let dateText;
        if (date.isSame(today, "day")) {
            dateText = date.format("hh:mm A");
        }
        else if (date.isSame(today, "year")) {
            dateText = date.format("DD MMM");
        }
        else {
            dateText = date.format("DD MMM YYYY hh:mm A");
        }
        //moment.unix(point.date/1000).format("DD MMM YYYY hh:mm A")
        return dateText;
    }

    static getStatusFullText(value) {
        let label = '';
        switch (value) {
            case "A":
                label = "Assigned";
                break;
            case "C":
                label = "Completed";
                break;
            case "PA":
                label = "President Approved";
                break;
            case "PR":
                label = "President Rejected";
                break;
            case "LA":
                label = "Panel Approved";
                break;
            case "LR":
                label = "Panel Rejected";
                break;
            case "PC":
                label = "Point Credited";
                break;
            default:
                break;
        }
        return label;
    }

    static getStatusColorCode(status) {
        let colorCode = '#eee';
        switch (status) {
            case "A":
                colorCode = "#C9BF60";
                break;
            case "C":
                colorCode = "#AFE38A";
                break;
            case "PA":
                colorCode = "#ccc";
                break;
            case "PR":
                colorCode = "#ccc";
                break;
            case "LA":
                colorCode = "#ccc";
                break;
            case "LR":
                colorCode = "#ccc";
                break;
            case "PC":
                colorCode = "#ccc";
                break;
            default:
                break;
        }
        return colorCode;
    }

    static getVoiceStatusText(voiceCode) {
        let statusText;
        switch (voiceCode) {
            case "UA":
                statusText = "Un Assigned";
                break;
            case "AS":
                statusText = "Assigned";
                break;
            case "IP":
                statusText = "In Progress";
                break;
            case "RJ":
                statusText = "Rejected";
                break;
            case "ES":
                statusText = "Escalated";
                break;
            case "RE":
                statusText = "Resolved";
                break;
            default:
                break;
        }
        return statusText;
    }

    getRoleCode(role) {
        let roleCode;
        role = role.toUpperCase();
        switch (role) {
            case "PRESIDENT":
                roleCode = "PR";
                break;
            case "PANEL":
                roleCode = "PA";
                break;
            case "USER":
                roleCode = "US";
                break;
            case "ADMIN":
                roleCode = "AD";
                break;
            case "AUDITOR":
                roleCode = "AU";
                break;
            default:
                throw { status: "Role not recognised in func getRoleCode" };
                break;
        }
        return roleCode;
    }

    static formatDateFromUnix(date, dateFormat = "DD MMM YYYY : HH:mm") {
        return moment.unix(date / 1000).format(dateFormat);
    }

    static overrideCommonDialogClasses() {
        return {
            root: "common-dialog-wrapper",
            paper: "common-dialog-body",
            paperWidthXs: "common-dialog-body-xs",
            paperWidthSm: "common-dialog-body-sm",
            paperWidthMd: "common-dialog-body-md",
            fullWidth: "common-dialog-body-fw",
            fullScreen: "common-dialog-body-fs"
        };
    }

    static generateHSLFromString(text) {
        //@DESC: Generating an hsl color from a text or number using cylindrical color representation.
        text = text + '';
        let num = 0;
        for (let i = 0; i < text.length; ++i) {
            num += (text.charCodeAt(i) * ((i % 3) + 1));
        }
        const hue = num % 255;
        const sat = "50%";
        const lgt = "50%";

        return `hsl(${hue}, ${sat}, ${lgt})`;
    }

    static flatArray(arr) {
        return [].concat(...arr);
    }

    static getStatusTree() {
        const pointCreditedNode = {
            code: "PC",
            label: Util.getStatusFullText("PC"),
            type: "success",
            success: null,
            fail: null
        };
        const panelRejectedNode = {
            code: "LR",
            label: Util.getStatusFullText("LR"),
            type: "fail",
            success: null,
            fail: null
        };
        const panelApprovedNode = {
            code: "LA",
            label: Util.getStatusFullText("LA"),
            type: "success",
            success: pointCreditedNode,
            fail: null
        };
        const presidentApprovedNode = {
            code: "PA",
            label: Util.getStatusFullText("PA"),
            type: "success",
            success: panelApprovedNode,
            fail: panelRejectedNode
        };
        const presidentRejectedNode = {
            code: "PR",
            label: Util.getStatusFullText("PR"),
            type: "fail",
            success: null,
            fail: null
        };
        const completedNode = {
            code: "C",
            label: Util.getStatusFullText("C"),
            type: "success",
            success: presidentApprovedNode,
            fail: presidentRejectedNode
        };
        const assignedNode = {
            code: "A",
            label: Util.getStatusFullText("A"),
            type: "success",
            success: completedNode,
            fail: null
        };
        const statusTree = assignedNode;
        return statusTree;
    }

    static getActivityHappyTree() {
        const statusTree = [
            { code: "A", label: Util.getStatusFullText("A"), type: "empty" },
            { code: "C", label: Util.getStatusFullText("C"), type: "empty" },
            { code: "PA", label: Util.getStatusFullText("PA"), type: "empty" },
            { code: "LA", label: Util.getStatusFullText("LA"), type: "empty" },
            { code: "PC", label: Util.getStatusFullText("PC"), type: "empty" },
        ];
        return [...statusTree];
    }
}
