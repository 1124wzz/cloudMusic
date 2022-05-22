<template>
	<view class="search">
		<head-nav title="搜索" :icon="true" color="black"></head-nav>
		<view class="index-search">
			<text class="iconfont icon-search"></text>
			<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleHistory(searchWord)" @input="handleTip">
			<text class="iconfont icon-guanbi" v-show="isShow" @tap="clearInput"></text>
		</view>
		<view class="container">
			<scroll-view scroll-y="true">
				<block v-if="searchType == 1">
					<view class="search-history" v-show="searchHistory.length">
						<view class="search-history-head">
							<view>历史记录</view>
							<text class="iconfont icon-lajitong" @tap="handleClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item, index) in searchHistory" :key="index" @tap="handleToWord(item)">
								{{ item }}</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-list">
							<view class="search-hot-item" v-for="(item, index) in hotList" :key="index"
								@tap="handleToWord(item.searchWord)">
								<view class="">{{ index + 1 }}</view>
								<view class="">{{ item.searchWord }}</view>
								<view class="">{{ item.score }}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item, index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-info">
								<view>{{ item.name }}</view>
								<view>
									<image align="absmiddle" src="../../static/无损音质.png" mode=""></image>
									<text>{{ item.artists[0].name }} - {{ item.album.name }}</text>
								</view>
							</view>
							<text class="iconfont icon-bofang_o"></text>
						</view>
					</view>
				</block>
				<block v-if="searchType == 3">
					<view class="search-tip">
						<view class="search-tip-head" @tap="getSearchList(searchValue)">
							<text>搜索"{{ searchValue }}"</text>
						</view>
						<view class="search-tip-item" v-for="(item, index) in searchTip" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont icon-search"></text>
							<text>{{ item.keyword }}</text>
						</view>
					</view>
				</block>
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
				hotList: [],
				searchWord: '',
				searchHistory: [],
				searchTip: [],
				searchType: 1,
				searchList: [],
				isShow: false,
				searchValue: ''
			}
		},
		components: {
			HeadNav
		},
		onLoad() {
			this.getHotList()
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			})
		},
		methods: {
			getHotList() {
				this.$request('/search/hot/detail').then(res => {
					this.hotList = res.data
				})
			},
			handleToWord(value) {
				this.searchWord = value
			},
			handleHistory(value) {
				this.searchHistory.unshift(value)
				this.searchHistory = [...new Set(this.searchHistory)]
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				this.getSearchList(value)
				this.isShow = true
			},
			handleClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				});
			},
			getSearchList(word) {
				this.$request('/search?keywords=' + word).then(res => {
					this.searchList = res.result.songs
					this.searchType = 2
					console.log(this.searchList);
				})
			},
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/Detail/Detail?songId=' + songId
				})
			},
			clearInput() {
				this.searchType = 1
				this.searchWord = ''
				this.isShow = false
			},
			handleTip(e) {
				let value = e.detail.value
				this.searchValue = value
				if(!value) {
					this.searchType = 1
					return
				}
				this.$request(`/search/suggest?keywords=${value}&type=mobile`).then(res => {
					this.searchTip = res.result.allMatch
				})
				this.searchType = 3
			}
		}
	}
</script>

<style scoped>
	.index-search {
		display: flex;
		align-items: center;
		height: 80rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background: #F5F5F5;
		border-radius: 25rpx;
	}

	.index-search text {
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin: 0 26rpx;
	}

	.index-search input {
		flex: 1;
	}

	.search-history {
		margin: 30rpx 20rpx 50rpx 20rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		margin-bottom: 30rpx;
	}

	.search-history-head text {
		font-size: 30rpx;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}

	.search-history-list view {
		padding: 20rpx 30rpx;
		font-size: 26rpx;
		background-color: #F5F5F5;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
	}

	.search-hot {
		margin: 30rpx;
	}

	.search-hot-head {
		font-size: 28rpx;

	}

	.search-hot-list {
		margin-top: 30rpx;
	}

	.search-hot-item {
		display: flex;
		margin-bottom: 50rpx;
	}

	.search-hot-item view:nth-child(1) {
		margin-right: 40rpx;
		width: 50rpx;
		color: firebrick;
	}

	.search-hot-item view:nth-child(2) {
		flex: 1;
	}

	.search-hot-item view:nth-child(3) {
		color: #878787;
	}
	.search-result {
		border-top: 1px solid #e4e4e4;
	}
	.search-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30rpx;
		padding-bottom: 40rpx;
		border-bottom: 1px solid #e4e4e4;
	}
	.search-result-item>text {
		font-size: 76rpx;	
		color: #878787;
	}
	.search-result-info view:nth-child(2){
		align-items: center;
		height: 50rpx;
		line-height: 50rpx;
	}
	.search-result-info view:nth-child(2) image {
		vertical-align: middle;
		width: 40rpx;
		height: 40rpx;
	}
	.search-result-info view:nth-child(2) text {
		vertical-align: middle;
		margin-left: 20rpx;
		width: 50rpx;
		height: 50rpx;
	}
	.search-result-info view:nth-child(1) {
		font-size: 36rpx;
		color: #235790;
	}
	.search-tip {
		padding: 30rpx;
		font-size: 26rpx;
		border-top: 1px solid #e4e4e4;
	}
	.search-tip-head {
		margin-bottom: 70rpx;
		color: #4574a5;
	}
	.search-tip-item {
		margin-bottom: 70rpx;
		color: #5d5d5d;
	}
	.search-tip-item text:nth-child(1) {
		margin-right: 30rpx;
		color: #bdbdbd;
	}
</style>
