export interface PermissionAwareService {

    requestPermissions(): Promise<void>;

}