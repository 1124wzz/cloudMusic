<template>
	<view class="list">
		<view class="fixbg" :style="{'background-image': 'url('+playlist.coverImgUrl+')'}"></view>
		<head-nav title="歌单" :icon="true"></head-nav>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="list-top">
					<view class="list-top-left">
						<image :src="playlist.coverImgUrl" mode=""></image>
					</view>
					<view class="list-top-right">
						<view class="">{{playlist.name}}</view>
						<view class="">
							<image :src="playlist.creator.avatarUrl" mode=""></image>
							<text>{{playlist.creator.nickname}}</text>
						</view>
						<view>{{ playlist.description }}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="share">
					<button open-type="share">
						<text class="iconfont icon-fenxiang"></text>分享给微信好友
					</button>
				</view>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-top">
						<text class="iconfont icon-bofang"></text>
						<text>播放全部</text>
						<text>(共{{ playlist.trackCount }}首)</text>
					</view>
					<view class="list-music-body" v-for="(item, index) in playlist.tracks" :key="index" @tap="handleToDetail(item.id)">
						<view class="list-music-num">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view class="list-music-text">{{ item.name }}</view>
							<view class="list-music-info">
								<image src="../../static/独家.png" mode=""></image>
								<image src="../../static/无损音质.png" mode=""></image>
								<text>{{ item.ar[0].name }} - {{ item.name }}</text>
							</view>
						</view>
						<view class="list-music-icon">
							<text class="iconfont icon-bofang_o"></text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import HeadNav from '@/components/Head/Head.vue'
	import '@/common/css/iconfont.css'
	export default {
		data() {
			return {
				playlist: {
					creator: {
						avatarUrl: ''
					},
					coverImgUrl: ''
				}
			}
		},
		components: {
			HeadNav
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			})
			this.getList(options.id)
		},
		methods: {
			getList(id) {
				this.$request('/playlist/detail?id=' + id)
						.then(res => {
							this.playlist = res.playlist
							uni.hideLoading();
							this.$store.commit('INIT_TABLISTIDS', res.playlist.trackIds)
						})
			},
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/Detail/Detail?songId=' + songId
				})
			}
		}
	}
</script>

<style scoped>
	.list-top {
		display: flex;
	}
	.list-top-left {
		margin: 30rpx;
		width: 400rpx;
		height: 300rpx;
		
	}
	.list-top-left image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	} 
	.list-top-right {
		margin-top: 30rpx;
	}
	.list-top-right view:nth-child(1) {
		font-size: 34rpx;
		margin-bottom: 30rpx;
	}
	.list-top-right view:nth-child(2) {
		display: flex;
		align-items: center;
		font-size: 30rpx;
	}
	.list-top-right view:nth-child(2) image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
		border-radius: 50%;
	}
	.list-top-right view:nth-child(3) {
		margin-top: 30rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #b2b2b2;
	}
	.share button {
		width: 340rpx;
		height: 74rpx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 37rpx;
		color: white;
		font-size: 28rpx;
		line-height: 74rpx;
		text-align: center;
	}
	.share text {
		margin-right: 20rpx;
	}
	.list-music {
		background-color: white;
		border: 50rpx;
		margin: 20rpx 0 72rpx 0;
		border-radius: 30rpx;
	}
	.list-music-top {
		padding-top: 20rpx;
		margin-left: 30rpx;
	}
	.list-music text:nth-child(1) {
		margin-right: 20rpx;
	}
	.list-music text:nth-child(2) {
		margin-right: 8rpx;
	}
	.list-music text:nth-child(3) {
		font-size: 28rpx;
		color: #b2b2b2;
	}
	.list-music-body {
		display: flex;
		margin-top: 40rpx;
		align-items: center;
	}
	.list-music-num {
		margin-left: 30rpx;
		margin-right: 20rpx;
		width: 50rpx;
		color: #b2b2b2;
		font-size: 36rpx;
		line-height: 25rpx;
	}
	.list-music-info {
		width: 520rpx;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-info image {
		width: 40rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.list-music-info text {
		font-size: 24rpx;
		color: #b2b2b2;
	}
	.list-music-song {
		flex: 1;
	}
	.list-music-icon text {
		font-size: 70rpx;
		color: #b2b2b2;
	}
</style>
