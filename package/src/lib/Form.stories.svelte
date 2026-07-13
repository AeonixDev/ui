<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";
	import Checkbox from "./Checkbox.svelte";
	import Form from "./Form.svelte";
	import Input from "./Input.svelte";
	import Select from "./Select.svelte";
	import Textarea from "./Textarea.svelte";

	type FormStoryArgs = {
		disabled: boolean;
		fullWidth: boolean;
		noValidate: boolean;
		readonly: boolean;
	};

	const { Story } = defineMeta({
		args: {
			disabled: false,
			fullWidth: true,
			noValidate: false,
			readonly: false,
		},
		argTypes: {
			disabled: {
				control: "boolean",
				description: "Disables all controls contained by the form.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
			fullWidth: {
				control: "boolean",
				description: "Makes direct children and supported controls fill the available width.",
				table: {
					category: "Appearance",
					defaultValue: { summary: "true" },
					type: { summary: "boolean" },
				},
			},
			noValidate: {
				control: "boolean",
				description: "Disables native browser validation when the form is submitted.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
			readonly: {
				control: "boolean",
				description: "Makes all contained fields readonly without changing their appearance.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
		},
		parameters: {
			controls: {
				include: ["disabled", "fullWidth", "noValidate", "readonly"],
			},
			docs: {
				description: {
					component:
						"A vertically spaced native form wrapper with submit and reset handlers. It controls child width and can disable or make fields readonly.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Form",
	});
</script>

{#snippet template(args: FormStoryArgs)}
	<Form
		class="w-full max-w-md"
		disabled={args.disabled}
		fullWidth={args.fullWidth}
		novalidate={args.noValidate}
		onreset={() => undefined}
		onsubmit={(event) => event.preventDefault()}
		readonly={args.readonly}
	>
		<label class="block text-sm font-medium" for="form-email">
			Email
			<Input id="form-email" name="email" type="email" required />
		</label>

		<label class="block text-sm font-medium" for="form-role">
			Role
			<Select id="form-role" name="role" required>
				<option value="">Choose a role</option>
				<option value="developer">Developer</option>
				<option value="designer">Designer</option>
			</Select>
		</label>

		<label class="block text-sm font-medium" for="form-message">
			Message
			<Textarea id="form-message" name="message" placeholder="How can we help?" required />
		</label>

		<label class="inline-flex items-center gap-2 text-sm" for="form-updates">
			<Checkbox id="form-updates" name="updates" value="yes" />
			Receive product updates
		</label>

		<div class="flex gap-2">
			<Button type="submit">Submit</Button>
			<Button type="reset" variant="secondary">Reset</Button>
		</div>
	</Form>
{/snippet}

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Readonly" args={{ readonly: true }} />

<Story name="Intrinsic width" args={{ fullWidth: false }} />
