import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

const initialState = {
	comments: [],
	loading: true,
	lastComments: [],
}

export const createPostComment = createAsyncThunk(
	'comments/createComment',
	async ({ postId, comment, author }) => {
		try {
			const { data } = await axios.post(`/comments/${postId}`, {
				postId,
				comment,
				author,
			})
			return data
		} catch (error) {
			console.log(error)
		}
	}
)

export const getLastComments = createAsyncThunk(
	'comments/getLastComments',
	async () => {
		try {
			const { data } = await axios.get(`/comments/lastcomments`)
			return data.comments
		} catch (error) {
			console.log(error)
		}
	}
)

export const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		savePostComments: (state, action) => {
			action.payload.hasOwnProperty('comments') &&
				(state.comments = action.payload.comments)
			state.loading = false
		},
	},
	extraReducers: {
		// Створення коментаря
		[createPostComment.pending]: (state) => {
			state.loading = true
		},
		[createPostComment.fulfilled]: (state, action) => {
			state.loading = false
			action.payload.hasOwnProperty('comment') &&
				state.comments.push(action.payload)
		},
		[createPostComment.rejected]: (state) => {
			state.loading = false
		},
		// Отримання коментарів
		// [getPostComments.pending]: (state) => {
		// 	state.loading = true
		// },
		// [getPostComments.fulfilled]: (state, action) => {
		// 	state.loading = false
		// 	state.comments = action.payload
		// },
		// [getPostComments.rejected]: (state) => {
		// 	state.loading = false
		// },
		// Отримання останніх коментарів
		[getLastComments.pending]: (state) => {
			state.loading = true
		},
		[getLastComments.fulfilled]: (state, action) => {
			state.loading = false
			state.lastComments = action.payload
		},
		[getLastComments.rejected]: (state) => {
			state.loading = false
		},
	},
})
export const { savePostComments } = commentsSlice.actions
export const commentsReducer = commentsSlice.reducer
