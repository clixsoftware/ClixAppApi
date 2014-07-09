/**
 * Created by developer on 2/12/14.
 */

/** data model that supports title **/


module.exports = {

    //db errors
    db_error: {
      code: 'db_error',
      message: 'Database connection error'
    },

    db_operation_error: {
        code: 'db_operation_error',
        message: 'An error occurred trying to save to the database.',
        description: 'More details about the error here',
        status: 400,
        success: false,
        developer: {
            message: 'Error occurred in the database operation',
            more_info: 'http:link'
        }

    },

    //add data field to transfer record
    recordCreationSuccess: {
        code: 'db_record_new_success',
        status: 201,
        success: true,
        user_message: 'Record created successfully.'
    },

    recordAlreadyExistsError: {
        code: 'db_record_exists',
        status: 409,
        success: false,
        user_message: 'Record already exist.',
        developer: {
            message: 'Error occurred in the database operation',
            more_info: 'http:link'
        }
    },

    recordNotFoundError: {
        code: 'db_record_exists',
        name: 'Recpard mpt found',
        status: 404,
        success: false,
        user_message: 'Record not found.',
        developer: {
            message: 'Error occurred in the database operation',
            more_info: 'http:link'
        }
    },

    //add data field to transfer record
    method_not_implemented: {
        code: 'method_not_implemented',
        status: 405,
        success: true,
        user_message: 'Method not implementd.'
    },

    user_already_exist_err : {
        code: 'user_already_exist_err',
        message: 'User already exists.'
    },


    no_record_found_error : {
        success: false,
        code: 'no_record_found_error',
        message: 'No record found error.',
        status: 405
    },

    id_missing_err : {
        code: 'id_missing_err',
        message: 'ID missing error'
    },

    idMissingError : {
        code: 'id_missing_err',
        message: 'Identifying ID missing',
        errors: {},
        status: 404
    },

    method_not_allowed_error: function(allowedMethods){
        return {
            code: 'id_missing_err',
            message: 'Only the following method(s) allowed ' + allowedMethods
        }
    },

    methodNotAllowedError:{
        code: 'method_not_allowed',
        message: 'Method not accepted on this resource.',
        errors: {},
        status: 405
    },


    profile_required_err : {
        code: 'profile_required_err',
        message: 'Profile required.'
    },

    title_err: {
        code: 'title_required',
        field: 'title',
        message: 'Title is a required field'
    },

    email_err : {
        code: 'username_required',
        field: 'email',
        message: 'User name is required'
    },

    password_err : {
        code: 'password_required',
        field: 'password',
        message: 'Password is required'
    },

    password_dont_match_err : {
        code: 'password_dont_match_err',
        message: 'Password dont match'
    },

    databaseError:{
        code: 'db_error',
        message: 'Contact administrator for this site.',
        errors: {},
        status: 500

    },

    profileRequiredError:{
        code: 'profile_required_error',
        message: 'Please contact administrator for a user profile',
        errors: {},
        status: 500
    },


    passwordDontMatchError : {
        code: 'password_dont_match_err',
        message: 'Password dont match',
        errors: {},
        status: 422
    },

    userAlreadyExistError : {
        code: 'userAlreadyExistError',
        message: 'User error',
        errors: {},
        status: 422
    },


    userNamePasswordRequiredError : {
        code: 'username_password_required',
        message: 'You must enter both a username and password',
        errors: {},
        status: 422
    },

    fieldValidationError : {
        code: 'field_validation_error',
        name: 'Field Validation Errors',
        message: 'One or more fields validation rule not met!',
        errors: {},
        status: 422
    },

    recordCreationError : {
        code: 'record_creation_error',
        name: 'Record Creation Errors',
        message: 'Error occurred while creating record.',
        errors: [],
        status: 422
    },


    invalidAccountPasswordError : {
        code: 'invalid_account_password',
        message: 'Invalid account or password',
        errors: {},
        status: 404
    },

    noRecordsFoundError : {
        code: 'no_records_found_error',
        message: 'No Records found error',
        errors: {},
        status: 404
    },


    err_results: function(ret_code, errors){

        ret_code.errors = errors;

        return {
            success: false,
            status: ret_code.status,
            item: ret_code
        };

    },


    data_err_msg: {
        code: 'data_error',
        message: 'Data Error',
        status: 400

    },

    data_success_msg : {
        code: 'data_success',
        message: 'Data Successful',
        status: 200
    },

    okLogin: {

        code: 'login_successful',
        message: 'User logged in successfully',
        status: 200
    },

    userCreateSuccessful: {
        code: 'user_create_success',
        message: 'User created successfully',
        status: 200
    },


    response_results: function(ret_code){

        return {
            success:  true,
            status: ret_code.status,
            item : ret_code
        }

    },


    success_results: function(ret_code, session){

        //expiring the session cookie
        var oldDateObj = new Date();
        var expiry_date = new Date(oldDateObj.getTime() + 60000);

        session.success = true;
        session.status = ret_code.status;
        session.item = ret_code;
        session.cookie.expires = expiry_date;

        return session;

 /*       return {
            success: true,
            status: ret_code.status,
            item: ret_code,
            cookie_expiry: expiry_date
        };*/
    }


};
