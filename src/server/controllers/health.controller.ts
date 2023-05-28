import BaseController from '../base/base-controller';
import {Get, Module} from '../../decorators/controller.decorator';
import {convertSecondsToDuration} from '../../utils/date-formatter';
import packageJson from '../../../package.json';

@Module('/')
export class HealthController extends BaseController {

    @Get()
    getHealth () {
        const {
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
        } = convertSecondsToDuration(process.uptime())

        let uptime = `${seconds} Seconds`

        if (minutes > 0) {
            uptime = `${minutes} Minutes`
        }

        if (hours > 0) {
            uptime = `${hours} Hours`
        }

        if (days > 0) {
            uptime = `${days} Days`
        }

        if (months > 0) {
            uptime = `${months} Months`
        }

        if (years > 0) {
            uptime = `${years} Years`
        }


        return {
            appName: packageJson.name,
            version: packageJson.version,
            uptime: uptime
        }
    }
}