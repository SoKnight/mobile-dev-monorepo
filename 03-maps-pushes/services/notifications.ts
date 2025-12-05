import * as Notifications from 'expo-notifications';
import {MapMarkerModel} from "@/types";
import {PermissionAwareService} from "@/services/services";

interface ActiveNotification {
    markerId: number;
    notificationId: string;
    timestamp: number;
}

class NotificationService implements PermissionAwareService {

    private activeNotifications: Map<number, ActiveNotification>;
    private knownNotificationIds: Set<number>;

    constructor() {
        this.activeNotifications = new Map();
        this.knownNotificationIds = new Set();

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        })
    }

    public async showNotification(marker: MapMarkerModel): Promise<void> {
        const isActive = this.activeNotifications.has(marker.id);
        const isPending = this.knownNotificationIds.has(marker.id);
        if (isActive || isPending) return;

        this.knownNotificationIds.add(marker.id);

        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Ты почти у цели!",
                    body: `Рядом с тобой: '${marker.title || `Маркер #${marker.id}`}'`,
                },
                trigger: null
            });

            this.activeNotifications.set(marker.id, {
                markerId: marker.id,
                notificationId,
                timestamp: Date.now()
            });
        } finally {
            this.knownNotificationIds.delete(marker.id);
        }
    }

    public async removeNotification(markerId: number): Promise<void> {
        const notification = this.activeNotifications.get(markerId);
        if (!notification) return;

        const id = notification.notificationId;

        try {
            await Notifications.dismissNotificationAsync(id);
        } catch { /* doesn't matter */ }

        try {
            await Notifications.cancelScheduledNotificationAsync(id);
        } catch { /* doesn't matter */ }

        this.activeNotifications.delete(markerId);
    }

    public async requestPermissions(): Promise<void> {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Notification permission denied!');
        }
    }

}

export const notificationService = new NotificationService();