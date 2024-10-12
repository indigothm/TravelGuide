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
import com.fasterxml.jackson.databind.util.ISO8601Utils
import java.text.ParsePosition

class NativeCalendarModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeCalendar")

    AsyncFunction("requestPermissions") { promise: Promise ->
      val permission = Manifest.permission.WRITE_CALENDAR
      if (ContextCompat.checkSelfPermission(appContext.reactContext!!, permission) == PackageManager.PERMISSION_GRANTED) {
        promise.resolve(true)
      } else {
        promise.resolve(false)
      }
    }

    AsyncFunction("addEvent") { title: String, location: String, startDateString: String, endDateString: String, promise: Promise ->
      try {
        val startDate = ISO8601Utils.parse(startDateString, ParsePosition(0))
        val endDate = ISO8601Utils.parse(endDateString, ParsePosition(0))

        val values = ContentValues().apply {
          put(CalendarContract.Events.TITLE, title)
          put(CalendarContract.Events.EVENT_LOCATION, location)
          put(CalendarContract.Events.DTSTART, startDate.time)
          put(CalendarContract.Events.DTEND, endDate.time)
          put(CalendarContract.Events.CALENDAR_ID, 1) // Default calendar
          put(CalendarContract.Events.EVENT_TIMEZONE, TimeZone.getDefault().id)
        }

        val uri = appContext.contentResolver.insert(CalendarContract.Events.CONTENT_URI, values)
        val eventId = uri?.lastPathSegment

        if (eventId != null) {
          val reminderValues = ContentValues().apply {
            put(CalendarContract.Reminders.EVENT_ID, eventId)
            put(CalendarContract.Reminders.MINUTES, 24 * 60) // 1 day before
            put(CalendarContract.Reminders.METHOD, CalendarContract.Reminders.METHOD_ALERT)
          }
          appContext.contentResolver.insert(CalendarContract.Reminders.CONTENT_URI, reminderValues)
          promise.resolve(eventId)
        } else {
          promise.reject("EVENT_ADD_FAILED", "Failed to add event")
        }
      } catch (e: Exception) {
        promise.reject("EVENT_ADD_ERROR", e.message, e)
      }
    }
  }
}
