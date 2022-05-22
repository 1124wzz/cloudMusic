<template>
	<view class="swiper">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="height: 150px;">
			<swiper-item v-for="(item, index) in banners" :key="index">
				<image :src="item.imageUrl" mode="" style="width: 700rpx; height: 300rpx; border-radius: 50rpx;"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			banners: {
				type: Array,
				default() {
					return []
				}
			}
		}
	}
</script>

<style>
	.swiper {
		width: 100%;
		text-align: center;
		margin-top: 50rpx;
		margin-bottom: 60rpx;
	}
</style>
