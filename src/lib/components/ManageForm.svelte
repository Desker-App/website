<script lang="ts">
	import type { UserResponse } from "$lib/message";
	export let user: UserResponse;
</script>

<form method="dialog">
	<label for="username">
		Username
		<input
			type="text"
			name="username"
			id="username"
      placeholder="Enter your wanted username"
			value={user.user_metadata.username || ""}
		/>
	</label>
</form>
