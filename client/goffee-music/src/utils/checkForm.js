const checkForm = async (form, callback) => {
	await form.validate(async (valid, fields) => {
		if (valid) {
			await callback && callback()
		} else {
			window.scrollTo(0, 0)
		}
	})
}



export default checkForm