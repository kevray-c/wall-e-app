import { api } from 'boot/axios'
import { useSettingStore } from 'src/stores/settingsStore'
import { computed } from 'vue'

const appStore = useSettingStore()

export const app = {
    connect: computed(() => appStore.getConnection),
    video: computed(() => appStore.getVideoSettings),
    ip: computed(() => appStore.getSettingById(1)),
    joysticks: computed(() => appStore.getAllJoysticks),
    lastJoystickId: computed(() => appStore.getLastJoystick),
    options: computed(() => appStore.getAllServos),
    setStatus(value) {
        appStore.setConnection(value)
    },
    updateIP(ip, port) {
            appStore.addItem('settings', {
              id: 1,
              ipaddress: ip,
              port: port,
            })
    },
    updateVideo(status, width, height) {
        appStore.addItem('video', {
          id: 1,
          show: status,
          width: width || app.video.value.width,
          height: height || app.video.value.height,
        })
},
    addJoystick(id, optionId, rest){
        appStore.addItem('joysticks', {
            id: id,
            ctrlId: optionId,
            restLock: rest
        })
    },
    updateOptions(value){
        appStore.addOptions(value)
    },
    removeItem(propField, id) {
        appStore.removeItem(propField, id)
    }
}


export function getJoySticks(){

    const joystickList = computed(() => app.joysticks.value.map(joystick =>{
        const option = app.options.value.find((item) => item.id === joystick.ctrlId)

        return {
            ...joystick,
            label: (option && option.label) || null,
            ctrl: (option && option.id) || null
        }

    }))

    return {
        joystickList
    }
}

export async function fetchOptions() {
    await api.get(`http://${app.ip.value.ipaddress}:${app.ip.value.port}/options`)
    .then(res => {
        app.updateOptions(res.data)
    })
    .catch(error => {
        console.log(error)
    })
}


export const getVideo = {
    url: `http://${app.ip.value.ipaddress}:${app.ip.value.port}/video`,
}