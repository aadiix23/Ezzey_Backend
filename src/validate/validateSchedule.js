const Joi = require("joi");

const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

const baseScheduleSchema = {
  type: Joi.string().valid("class", "test", "exam").required().messages({
    "any.only": "Type must be one of: class, test, exam",
    "any.required": "Type is required"
  }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date format",
    "any.required": "Date is required"
  }),
  startTime: Joi.string().pattern(timePattern).required().messages({
    "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
    "any.required": "Start time is required"
  }),
  endTime: Joi.string().pattern(timePattern).required().messages({
    "string.pattern.base": "End time must be in HH:MM format (24-hour)",
    "any.required": "End time is required"
  }),
  subject: Joi.string().trim().min(1).required().messages({
    "string.empty": "Subject cannot be empty",
    "string.min": "Subject must be a non-empty string",
    "any.required": "Subject is required"
  }),
  faculty: Joi.string().trim().min(1).required().messages({
    "string.empty": "Faculty cannot be empty",
    "string.min": "Faculty must be a non-empty string",
    "any.required": "Faculty is required"
  }),
  classroom: Joi.string().trim().min(1).required().messages({
    "string.empty": "Classroom cannot be empty",
    "string.min": "Classroom must be a non-empty string",
    "any.required": "Classroom is required"
  }),
  batch: Joi.string().trim().min(1).required().messages({
    "string.empty": "Batch cannot be empty",
    "string.min": "Batch must be a non-empty string",
    "any.required": "Batch is required"
  }),
  department: Joi.string().trim().min(1).required().messages({
    "string.empty": "Department cannot be empty",
    "string.min": "Department must be a non-empty string",
    "any.required": "Department is required"
  }),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("scheduled", "cancelled", "completed").optional().messages({
    "any.only": "Status must be one of: scheduled, cancelled, completed"
  })
};

const createScheduleSchema = Joi.object({
  ...baseScheduleSchema,
  period: Joi.number().integer().positive().optional(),
  duration: Joi.number().positive().optional()
})
  .custom((value, helpers) => {
    if (value.type === "class") {
      if (!value.period) {
        return helpers.error("custom.periodRequired");
      }
      if (value.duration !== undefined) {
        return helpers.error("custom.durationNotAllowed");
      }
    }

    if (value.type === "test" || value.type === "exam") {
      if (!value.duration) {
        return helpers.error("custom.durationRequired");
      }
      if (value.period !== undefined) {
        return helpers.error("custom.periodNotAllowed");
      }
    }

    const [startHours, startMinutes] = value.startTime.split(":").map(Number);
    const [endHours, endMinutes] = value.endTime.split(":").map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;

    if (endTotal <= startTotal) {
      return helpers.error("custom.timeOrder");
    }
    return value;
  })
  .messages({
    "custom.periodRequired": "Period is required for class schedules",
    "custom.durationRequired": "Duration is required for test and exam schedules",
    "custom.periodNotAllowed": "Period is only allowed for class schedules",
    "custom.durationNotAllowed": "Duration is only allowed for test and exam schedules",
    "custom.timeOrder": "End time must be after start time"
  });

const updateScheduleSchema = Joi.object({
  type: Joi.string().valid("class", "test", "exam").optional().messages({
    "any.only": "Type must be one of: class, test, exam"
  }),
  date: Joi.date().optional().messages({
    "date.base": "Date must be a valid date format"
  }),
  startTime: Joi.string().pattern(timePattern).optional().messages({
    "string.pattern.base": "Start time must be in HH:MM format (24-hour)"
  }),
  endTime: Joi.string().pattern(timePattern).optional().messages({
    "string.pattern.base": "End time must be in HH:MM format (24-hour)"
  }),
  period: Joi.number().integer().positive().optional().messages({
    "number.base": "Period must be a number",
    "number.integer": "Period must be an integer",
    "number.positive": "Period must be a positive integer (1, 2, 3, etc.)"
  }),
  duration: Joi.number().positive().optional().messages({
    "number.base": "Duration must be a number",
    "number.positive": "Duration must be a positive number (in minutes)"
  }),
  subject: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Subject cannot be empty",
    "string.min": "Subject must be a non-empty string"
  }),
  faculty: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Faculty cannot be empty",
    "string.min": "Faculty must be a non-empty string"
  }),
  classroom: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Classroom cannot be empty",
    "string.min": "Classroom must be a non-empty string"
  }),
  batch: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Batch cannot be empty",
    "string.min": "Batch must be a non-empty string"
  }),
  department: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Department cannot be empty",
    "string.min": "Department must be a non-empty string"
  }),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("scheduled", "cancelled", "completed").optional().messages({
    "any.only": "Status must be one of: scheduled, cancelled, completed"
  })
})
  .custom((value, helpers) => {
    if (value.startTime && value.endTime) {
      const [startHours, startMinutes] = value.startTime.split(":").map(Number);
      const [endHours, endMinutes] = value.endTime.split(":").map(Number);
      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      if (endTotal <= startTotal) {
        return helpers.error("custom.timeOrder");
      }
    }
    return value;
  })
  .messages({
    "custom.timeOrder": "End time must be after start time"
  });

const conflictCheckSchema = Joi.object({
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date format",
    "any.required": "Date is required"
  }),
  startTime: Joi.string().pattern(timePattern).required().messages({
    "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
    "any.required": "Start time is required"
  }),
  endTime: Joi.string().pattern(timePattern).required().messages({
    "string.pattern.base": "End time must be in HH:MM format (24-hour)",
    "any.required": "End time is required"
  }),
  faculty: Joi.string().trim().optional(),
  classroom: Joi.string().trim().optional(),
  batch: Joi.string().trim().optional()
})
  .custom((value, helpers) => {
    const [startHours, startMinutes] = value.startTime.split(":").map(Number);
    const [endHours, endMinutes] = value.endTime.split(":").map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;

    if (endTotal <= startTotal) {
      return helpers.error("custom.timeOrder");
    }
    return value;
  })
  .messages({
    "custom.timeOrder": "End time must be after start time"
  });

const validateCreateSchedule = (req, res, next) => {
  const { error, value } = createScheduleSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors
    });
  }

  req.body = value;
  next();
};

const validateUpdateSchedule = (req, res, next) => {
  const { error, value } = updateScheduleSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors
    });
  }

  req.body = value;
  next();
};

const validateConflictCheck = (req, res, next) => {
  const { error, value } = conflictCheckSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors
    });
  }

  req.query = value;
  next();
};

module.exports = {
  validateCreateSchedule,
  validateUpdateSchedule,
  validateConflictCheck
};

