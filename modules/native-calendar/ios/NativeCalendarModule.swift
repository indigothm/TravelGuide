import ExpoModulesCore
import EventKit

public class NativeCalendarModule: Module {
  private let eventStore = EKEventStore()

  public func definition() -> ModuleDefinition {
    Name("NativeCalendar")

    AsyncFunction("requestPermissions") { (promise: Promise) in
        if #available(iOS 17.0, *) {
            self.eventStore.requestFullAccessToEvents { granted, error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve(granted)
                }
            }
        } else {
            self.eventStore.requestAccess(to: .event) { granted, error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve(granted)
                }
            }
        }
    }

    AsyncFunction("addEvent") { (title: String, location: String, startDateString: String, endDateString: String, promise: Promise) in
        
           let dateFormatter = ISO8601DateFormatter()
           
           guard let startDate = dateFormatter.date(from: startDateString),
                 let endDate = dateFormatter.date(from: endDateString) else {
               promise.reject(NSError(domain: "NativeCalendarError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid date format"]))
               return
           }
        
          let event = EKEvent(eventStore: self.eventStore)
          event.title = title
          event.location = location
          event.startDate = startDate
          event.endDate = endDate
          event.calendar = self.eventStore.defaultCalendarForNewEvents

          let alarm = EKAlarm(relativeOffset: -86400) // 1 day before
          event.addAlarm(alarm)

          do {
            try self.eventStore.save(event, span: .thisEvent)
              promise.resolve(event.eventIdentifier)
          } catch {
              promise.reject(error)
          }
    }
  }
}
