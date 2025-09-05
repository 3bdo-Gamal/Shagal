
function errorHandler(err, req, res, next) {
  console.error("Error: ", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";


  switch (err.code) {
    case "ER_DUP_ENTRY":
      statusCode = 400;
      message = "Duplicate entry - this value must be unique";
      break;
    case "ER_NO_REFERENCED_ROW_2":
      statusCode = 400;
      message = "Invalid reference - related record not found";
      break;
    case "ER_ROW_IS_REFERENCED_2":
      statusCode = 400;
      message = "This record is in use and cannot be deleted";
      break;
    case "ER_CHECK_CONSTRAINT_VIOLATED":
      statusCode = 400;
      message = "Validation failed - data does not meet requirements";
      break;
    case "ER_WRONG_VALUE_FOR_TYPE":
      statusCode = 400;
      message = "Invalid value for a field - check allowed options";
      break;
    case "ER_TRUNCATED_WRONG_VALUE":
    case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
      statusCode = 400;
      message = "Invalid data type - please check your input values";
      break;
    case "ER_BAD_NULL_ERROR":
      statusCode = 400;
      message = "Missing required field";
      break;
  }


  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token - please login again";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired - please login again";
  }

 
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message || "Validation failed - check your input";
  }

 
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }


  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      error: err,       
      stack: err.stack, 
    });
  }


  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
}

module.exports = errorHandler;
