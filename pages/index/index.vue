<template>
	<view class="content">
		<head-nav title="网易云音乐" :icon="false" color="black"></head-nav>
		<view class="skeleton">
			<m-for-skeleton :avatarSize="200" :row="3" :loading="loading" isarc="square" v-for="(item,key) in 6"
				:key="key" :title="false" :titleStyle="{}">
			</m-for-skeleton>
		</view>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-search"></text>
					<input type="text" placeholder="搜索歌曲">
				</view>
				<swiper-uni :banners="banners"></swiper-uni>
				<view class="index-list">
					<view class="index-list-item" v-for="(item, index) in tabList" :key="index"
						@click="toList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{ item.updateFrequency }}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(item, index) in item.tracks" :key="index">
								{{ index + 1 }}. {{ item.first }} - {{ item.second }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import SwiperUni from '@/components/Swiper/Swiper.vue'
	import HeadNav from '@/components/Head/Head.vue'
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	export default {
		data() {
			return {
				tabList: [],
				banners: [],
				loading: true
			}
		},
		components: {
			HeadNav,
			SwiperUni,
			mForSkeleton
		},
		onLoad() {
			this.getTabList()
			uni.showLoading({
				title: '加载中...'
			})
			this.getBanner()
		},
		methods: {
			getTabList() {
				this.$request('/toplist/detail')
					.then(res => {
						this.tabList = res.list
						this.tabList.length = 4;
						uni.hideLoading()
						this.loading = false
					})
			},
			toList(id) {
				uni.navigateTo({
					url: '/pages/LIst/LIst?id=' + id
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/Search/Search'
				})
			},
			getBanner() {
				this.$request('/banner').then(res => {
					this.banners = res.banners
				})
			}
		}
	}
</script>

<style scoped>
	.index-search {
		display: flex;
		align-items: center;
		margin: 70rpx 30rpx 30rpx 30rpx;
		height: 80rpx;
		background-color: #F5F5F5;
		border-radius: 25rpx;
	}

	.index-search text {
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.index-list-item {
		display: flex;
		margin: 20rpx 30rpx;
	}

	.index-list-img {
		position: relative;
		width: 212rpx;
		height: 212rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.index-list-img image {
		width: 212rpx;
		height: 212rpx;
	}

	.index-list-img text {
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		font-size: 20rpx;
		color: white;
	}

	.index-list-text {
		flex: 1;
		margin-left: 22rpx;
		line-height: 66rpx;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
