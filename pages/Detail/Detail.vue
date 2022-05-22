<template>
	<view class="detail">
		<view class="fixbg" :style="{'background-image': 'url('+ songDetail.al.picUrl+')'}"></view>
		<head-nav :icon="true" :title="songDetail.name"></head-nav>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="detail-title" v-show="loading">
					<image src="~@/static/detail/clude.jpg" mode=""></image>
					<text>网易云音乐</text>
				</view>
				<view class="detail-image" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{'detail-image-run': isPlayRotate}" mode=""></image>
					<text class="iconfont" :class="iconPlay"></text>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-warp" :style="{ transform: 'translateY('+ -(lyricIndex - 1) * 82 +'rpx)'}">
						<view class="detail-lyric-item" :class="{ active: lyricIndex == index }"
							v-for="(item, index) in lyric" :key="index">{{ item.lyric }}</view>
					</view>
				</view>
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item, index) in simiSong" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-item-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-song">
							<view class="detail-song-text">{{ item.name }}</view>
							<view class="detail-song-info">
								<image src="../../static/无损音质.png" mode=""></image>
								<text>{{item.album.artists[0].name}} - {{ item.name }}</text>
							</view>
						</view>
						<view class="detail-like-icon">
							<text class="iconfont icon-bofang_o"></text>
						</view>
					</view>
				</view>
				<view class="detail-comment">
					<view class="comment-head">精彩评论</view>
					<view class="comment-info" v-for="(item,index) in comment" :key="index">

						<view class="comment-info-content">
							<view class="comment-info-good">
								<view class="comment-info-avatar">
									<image :src="item.user.avatarUrl" mode=""></image>
								</view>
								<view class="comment-info-author">
									<text>{{ item.user.nickname }}</text>
									<image src="../../static/detail/clude.jpg" mode=""></image>
									<view>{{ item.timeStr }}</view>
								</view>
								<view class="comment-info-count">
									{{ item.likedCount }}
									<text class="iconfont icon-dianzan"></text>
								</view>
							</view>
							<view class="comment-content">{{item.content}}</view>
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
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				simiSong: [],
				comment: [],
				loading: false,
				lyric: [],
				lyricIndex: 0,
				iconPlay: 'icon-zanting',
				isPlayRotate: true
			}
		},
		components: {
			HeadNav
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			})
			this.getSongDetail(options.songId)
			this.getSimiSong(options.songId)
			this.getComment(options.songId)
			this.getLyric(options.songId)
			this.getSongUrl(options.songId)
			this.$store.commit('INIT_NEXTID', options.songId)
		},
		onUnload() {
			this.cancelLyric()
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			this.cancelLyric()
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		methods: {
			getSongDetail(ids) {
				this.$request('/song/detail?ids=' + ids).then(res => {
					this.songDetail = res.songs[0]
				})
			},
			getSimiSong(id) {
				this.$request('/simi/song?id=' + id).then(res => {
					this.simiSong = res.songs
				})
			},
			getComment(id) {
				this.$request('/comment/music?id=' + id).then(res => {
					this.comment = res.hotComments
					uni.hideLoading()
					this.loading = true
				})
			},
			getLyric(id) {
				this.$request('/lyric?id=' + id).then(res => {
					let lyric = res.lrc.lyric
					let re = /\[([^\]]+)\]([^\[]+)/g
					let result = []
					lyric.replace(re, ($0, $1, $2) => {
						result.push({
							"time": this.formatTime($1),
							"lyric": $2
						})
					})
					this.lyric = result
				})
			},
			getSongUrl(id) {
				this.$request('/song/url?id=' + id).then(res => {
					// #ifdef MP-WEIXIN
					this.bgAudioManager = uni.getBackgroundAudioManager();
					this.bgAudioManager.title = this.songDetail.name;
					// #endif
					
					// #ifdef H5
					if(!this.bgAudioManager) {
						this.bgAudioManager = uni.createInnerAudioContext();
					}
					this.iconPlay = 'icon-bofang'
					this.isPlayRotate = false
					// #endif
					this.bgAudioManager.src = res.data[0].url
					this.listenLysicIndex()
					this.bgAudioManager.onPlay(() => {
						this.iconPlay = 'icon-zanting';
						this.isPlayRotate = true
						this.listenLysicIndex()
					})
					this.bgAudioManager.onPause(() => {
						this.iconPlay = 'icon-bofang';
						this.isPlayRotate = false
						this.cancelLyric()
					})
					this.bgAudioManager.onEnded(() => {
						this.getSongDetail(this.$store.state.nextId)
						this.getSongUrl(this.$store.state.nextId)
						this.getSimiSong(this.$store.state.nextId)
						this.getComment(this.$store.state.nextId)
						this.getLyric(this.$store.state.nextId)
						this.bgAudioManager.play()
					})
				})
			},
			formatTime(value) {
				let arr = value.split(':')
				return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1)
			},
			handleToPlay() {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
				}
			},
			listenLysicIndex() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					for (var i = 0; i < this.lyric.length; i++) {
						if (this.bgAudioManager.currentTime > this.lyric[this.lyric.length - 1].time) {
							this.lyricIndex = this.lyric.length - 1
							break
						}
						if (this.bgAudioManager.currentTime > this.lyric[i].time && this.bgAudioManager.currentTime <	this.lyric[i + 1].time) {
							this.lyricIndex = i
						}
					}
				}, 300)
			},
			cancelLyric() {
				clearInterval(this.timer)
			},
			handleToSimi(songId) {
				this.getSongDetail(songId)
				this.getSongUrl(songId)
				this.getSimiSong(songId)
				this.getComment(songId)
				this.getLyric(songId)
			}
		}
	}
</script>

<style scoped>
	.detail-title {
		display: flex;
		align-items: center;
		margin: 30rpx 30rpx 0 0;
		height: 50rpx;
	}

	.detail-title image {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-left: 30rpx;
		margin-right: 10rpx;
	}

	.detail-title text {
		font-size: 28rpx;
		color: white;
	}

	.detail-image {
		position: relative;
		width: 580rpx;
		height: 580rpx;
		background: url('@/static/detail/videodisc.png');
		background-size: cover;
		margin: 108rpx auto 0 auto;
	}

	.detail-image image {
		position: absolute;
		left: 100rpx;
		right: 0;
		top: 115rpx;
		bottom: 0;
		margin: 0;
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		animation: 10s linear move infinite;
		animation-play-state: paused;
	}

	.detail-image .detail-image-run {
		animation-play-state: running;
	}

	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.detail-image text {
		position: absolute;
		left: 236rpx;
		right: 0;
		top: 238rpx;
		bottom: 0;
		margin: 0;
		font-size: 100rpx;
		color: white;
		width: 100rpx;
		height: 100rpx;
	}

	.detail-lyric {
		font-size: 32rpx;
		margin-top: 30rpx;
		height: 246rpx;
		text-align: center;
		color: #6f6e73;
		overflow: hidden;
	}
	.detail-lyric-warp {
		transition: .1s;
	}
	.detail-lyric-item {
		line-height: 82rpx;
		font-size: 32rpx;
		height: 82rpx;
	}

	.detail-lyric-item.active {
		color: white;
	}

	.detail-like {
		margin: 30rpx 0 30rpx 30rpx;
	}

	.detail-like-head {
		font-size: 36rpx;
		margin-bottom: 40rpx;
		color: white;
	}

	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		margin-right: 40rpx;
	}

	.detail-item-img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 22rpx;
		border-radius: 15rpx;
		margin-top: 20rpx;
	}

	.detail-item-img image {
		width: 100%;
		height: 100%;
	}

	.detail-song {
		flex: 1;
	}

	.detail-song-info {
		align-items: center;
		font-size: 28rpx;
	}

	.detail-song-info text {
		color: #919193;
	}

	.detail-song-text {
		color: white;
	}

	.detail-song-info image {
		height: 40rpx;
		width: 40rpx;
		margin-right: 20rpx;
	}

	.detail-like-icon {
		width: 50rpx;
	}

	.detail-like-icon text {
		font-size: 70rpx;
		color: #919193;
	}

	.detail-comment {
		margin: 30rpx 0 30rpx 30rpx;
	}

	.comment-head {
		font-size: 36rpx;
		margin-bottom: 40rpx;
		color: white;
	}

	.comment-info {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.comment-info-avatar {
		margin-top: -14rpx;
		margin-right: 30rpx;
		width: 76rpx;
		height: 76rpx;

	}

	.comment-info-avatar image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.comment-info-good {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.comment-info-author {
		width: 310rpx;
	}

	.comment-info-author image {
		margin-left: 20rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.comment-info-author text {
		color: white;
	}

	.comment-info-author view {
		color: #919193;
		font-size: 20rpx;
	}

	.comment-info-count {
		color: white;
		margin-right: 30rpx;
		margin-left: 150rpx;
	}

	.comment-info-count text {
		margin-left: 10rpx;
		color: white;
	}

	.comment-content {
		padding-bottom: 30rpx;
		margin-left: 100rpx;
		color: white;
		width: 600rpx;
		border-bottom: 1px solid #919193;

	}
</style>
