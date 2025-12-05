import * as Location from "expo-location";
import {LatLng} from "react-native-maps";
import {MapMarkerList} from "@/types";
import {PermissionAwareService} from "@/services/services";
import {notificationService} from "@/services/notifications";

let EARTH_RADIUS = 6371e3;
let NEARBY_THRESHOLD = 100;

let DEFAULT_CONFIG: LocationConfig = {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000,
    distanceInterval: 20
}

interface LocationConfig {
    accuracy: Location.Accuracy;
    timeInterval: number;
    distanceInterval: number;
}

class LocationService implements PermissionAwareService {

    private readonly config: LocationConfig;

    private location: LatLng | null;
    private subscription: Location.LocationSubscription | null;

    constructor(config?: Partial<LocationConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.location = null;
        this.subscription = null;
    }

    public async lookupMarkersNearby(currentlyAt: LatLng, markers: MapMarkerList): Promise<void> {
        await Promise.all(markers.map(marker => {
            const distance = this.calculateDistance(currentlyAt, marker.location);
            if (distance <= NEARBY_THRESHOLD) {
                return notificationService.showNotification(marker);
            } else {
                return notificationService.removeNotification(marker.id);
            }
        }));
    }

    public async obtainCurrentLocation(): Promise<LatLng | null> {
        if (this.location)
            return this.location;

        try {
            const result = await Location.getCurrentPositionAsync({ accuracy: this.config.accuracy });
            this.location = result.coords;
            return this.location;
        } catch (ex) {
            console.log("Couldn't obtain current location:", ex);
            return null;
        }
    }

    public async startLocationUpdates(
        onLocation: (location: LatLng) => void
    ): Promise<Location.LocationSubscription | null> {
        if (this.subscription) return this.subscription;

        this.subscription = await Location.watchPositionAsync(this.config, (loc) => {
            this.location = loc.coords;
            onLocation(this.location);
        });

        return this.subscription;
    }

    public stopLocationUpdates(): void {
        this.subscription?.remove();
        this.subscription = null;
    }

    public async requestPermissions(): Promise<void> {
        const { status: foreground } = await Location.requestForegroundPermissionsAsync();
        if (foreground !== 'granted')
            throw new Error('Location (foreground) permission denied!');

        const { status: background } = await Location.requestBackgroundPermissionsAsync();
        if (background !== 'granted') {
            throw new Error('Location (background) permission denied!');
        }
    }

    private calculateDistance(from: LatLng, to: LatLng): number {
        const toRadians = (deg: number) => (deg * Math.PI) / 180;

        const phi1 = toRadians(from.latitude);
        const phi2 = toRadians(to.latitude);
        const phiD = toRadians(to.latitude - from.latitude);
        const lambdaD = toRadians(to.longitude - from.longitude);

        const sinHalfPhiD = Math.sin(phiD / 2);
        const sinHalfLambdaD = Math.sin(lambdaD / 2);

        const a = sinHalfPhiD * sinHalfPhiD + Math.cos(phi1) * Math.cos(phi2) * sinHalfLambdaD * sinHalfLambdaD;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }

}

export const locationService = new LocationService();