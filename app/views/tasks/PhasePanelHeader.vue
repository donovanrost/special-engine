<template>
    <GridLayout :backgroundColor="backgroundColor" columns="40, *, 40"
        @tap="onTap"
        rows="40" :class="'cp-header ' + (showPanel ? 'opened' : 'closed')"
        iosOverflowSafeArea="false">
        <GridLayout col="0" class="cp-icon" iosOverflowSafeArea="false">
            <Label :text="itemList.length" horizontalAlignment="center" color="white"/>
        </GridLayout>
        <GridLayout col="1" iosOverflowSafeArea="false">
            <Label :text="phase" verticalAlignment="center"
                horizontalAlignment="center" class="cp-title"
                color="white"
                iosOverflowSafeArea="false" />
        </GridLayout>
        <GridLayout  col="2" class="cp-expand" iosOverflowSafeArea="false">
            <Label ref="openIcon" class="fa" :text=" 'fa-chevron-up' | fonticon" 
            textWrap="true"
            horizontalAlignment="center"
            size="18"></Label>

        </GridLayout>
    </GridLayout>

</template>

<script>
import { getViewById } from 'tns-core-modules/ui/page/page';
import { Animation } from 'tns-core-modules/ui/animation/animation';

export default {
    props: {
        itemList: {
            type: Array
        },
        phase: {
            type: String
        }
    },
    data() {
        return {
            backgroundColor: "#2d2d2d",
            icon: "fa-user",
            showPanel: true,
            fixedHeight: 0
        }
    },
    methods: {
        onTap() {
            let openIcon = this.$refs.openIcon.nativeView
            console.log(openIcon)
            openIcon.animate({
                rotate: 360,
                duration:  500
            })
            .then(() => {
                console.log('DONE ANIMATING')
            })
            this.$emit('headerTap')
        }
    }


};
</script>

<style>
.cp-header {
    border-top-left-radius: 5;
    border-top-right-radius: 5;
}
.cp-icon, .cp-expand {
    color: white;
    font-size: 20;
}


.cp-title {
    font-size: 20;
    text-transform: uppercase;
    /* font-weight: bold; */
}
</style>