export const useNotifications = () => {
    const permission = ref<NotificationPermission | 'default'>('default');

    onMounted(() => {
        if ('Notification' in window) {
            permission.value = Notification.permission;
        }
    });

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.error('This browser does not support notifications.');
            return false;
        }

        const res = await Notification.requestPermission();
        permission.value = res;
        return res === 'granted';
    };

    const notify = (title: string, options?: NotificationOptions) => {
        if (permission.value === 'granted') {
            new Notification(title, {
                icon: '/icon.png',
                ...options
            });
        }
    };

    return {
        permission,
        requestPermission,
        notify
    };
};
