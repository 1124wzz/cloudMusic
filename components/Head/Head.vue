<template>
	<view class="index-head" :style="{'color': color}">
		<view class="index-icon" v-if="icon" :style="{ 'color': color}">
			<text class="iconfont icon-zuojiantou" @click="handlePre"></text> | <text class="iconfont icon-shouye" @tap="handleHome"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	import '@/common/css/iconfont.css'
	export default {
		name:"Head",
		data() {
			return {
				
			};
		},
		props: ['title', 'icon', 'color'],
		methods: {
			handlePre() {
				uni.navigateBack()
			},
			handleHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.index-head {
		position: relative;
		text-align: center;
		width: 100%;
		height: 75px;
		line-height: 80px;
		color: white;
	}
	.index-icon {
		position: absolute;
		display: flex;
		justify-content: space-evenly;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 15px;
		left: 8px;
		top: 26px;
		width: 90px;
		height: 31px;
		line-height: 31px;
		color: white;
	}
</style>