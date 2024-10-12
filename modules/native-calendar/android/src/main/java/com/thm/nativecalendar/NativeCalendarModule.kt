package com.thm.nativecalendar

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.ContentValues
import android.provider.CalendarContract
import java.util.*
import expo.modules.kotlin.Promise
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.core.app.ActivityCompat


class NativeCalendarModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeCalendar")

     AsyncFunction("requestPermissions") { promise: Promise ->
      val permissions = arrayOf(
        Manifest.permission.READ_CALENDAR,
        Manifest.permission.WRITE_CALENDAR
      )
      
      val activity = appContext.currentActivity
       val CALENDAR_PERMISSION_REQUEST_CODE = 100
        if (activity == null) {
           promise.reject(
          "ACTIVITY_NOT_FOUND",
          "Current activity is null",
          Exception("Activity not found")
        )
        return@AsyncFunction
      }

      if (permissions.all { ContextCompat.checkSelfPermission(activity, it) == PackageManager.PERMISSION_GRANTED }) {
        promise.resolve(true)
      } else {
        ActivityCompat.requestPermissions(
          activity,
          permissions,
          CALENDAR_PERMISSION_REQUEST_CODE
        )
        promise.resolve(false)
      }
    }

    AsyncFunction("addEvent") { title: String, location: String, startDateString: String, endDateString: String, promise: Promise ->
      try {
        val startDate = parseISODate(startDateString)
        val endDate = parseISODate(endDateString)

        val values = ContentValues().apply {
          put(CalendarContract.Events.TITLE, title)
          put(CalendarContract.Events.EVENT_LOCATION, location)
          put(CalendarContract.Events.DTSTART, startDate)
          put(CalendarContract.Events.DTEND, endDate)
          put(CalendarContract.Events.CALENDAR_ID, 1) // Default calendar
          put(CalendarContract.Events.EVENT_TIMEZONE, TimeZone.getDefault().id)
        }

        val uri = appContext.reactContext?.contentResolver?.insert(CalendarContract.Events.CONTENT_URI, values)
        val eventId = uri?.lastPathSegment

        if (eventId != null) {
          val reminderValues = ContentValues().apply {
            put(CalendarContract.Reminders.EVENT_ID, eventId.toLong())
            put(CalendarContract.Reminders.MINUTES, 24 * 60) // 1 day before
            put(CalendarContract.Reminders.METHOD, CalendarContract.Reminders.METHOD_ALERT)
          }
          appContext.reactContext?.contentResolver?.insert(CalendarContract.Reminders.CONTENT_URI, reminderValues)
          promise.resolve(eventId)
        } else {
          //promise.reject("EVENT_ADD_FAILED", "Failed to add event")
        }
      } catch (e: Exception) {
        promise.reject("EVENT_ADD_ERROR", e.message ?: "Unknown error", e)
      }
    }
  }

  private fun parseISODate(dateString: String): Long {
    val regex = Regex("(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})(?:\\.\\d+)?Z?")
    val matchResult = regex.find(dateString)

    if (matchResult != null) {
      val (year, month, day, hour, minute, second) = matchResult.destructured
      val calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
      calendar.set(year.toInt(), month.toInt() - 1, day.toInt(), hour.toInt(), minute.toInt(), second.toInt())
      return calendar.timeInMillis
    } else {
      throw IllegalArgumentException("Invalid date format: $dateString")
    }
  }
}
