import DeviceActivity
import Foundation

final class EkkoDeviceActivityMonitor: DeviceActivityMonitor {
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)

        switch activity {
        case EkkoScreenTime.morningActivity:
            EkkoScreenTime.applyCurrentShield()
        default:
            break
        }
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)

        switch activity {
        case EkkoScreenTime.peekActivity, EkkoScreenTime.morningActivity:
            EkkoScreenTime.applyCurrentShield()
        default:
            break
        }
    }
}
