import type { Variant } from "./types.js";

export type ToastId = string;
export type ToastPosition = `${"bottom" | "top"}-${"center" | "left" | "right"}`;

export type ToastOptions = {
	dismissible?: boolean;
	duration?: number;
	id?: ToastId;
	message: string;
	position?: ToastPosition;
	title?: string;
	variant?: Variant;
};

export type ToastData = Required<
	Pick<ToastOptions, "dismissible" | "duration" | "id" | "message" | "position" | "variant">
> &
	Pick<ToastOptions, "title">;

export type ToastContext = {
	readonly toasts: ToastData[];
	addToast: (toast: ToastOptions) => ToastId;
	removeToast: (id: ToastId) => void;
};

export const toastContextKey = Symbol("toast");

const toastContexts: ToastContext[] = [];
let nextGlobalId = 0;
let pendingToasts: ToastOptions[] = [];

export function addToast(toast: ToastOptions): ToastId {
	const id = toast.id ?? `toast-global-${++nextGlobalId}`;
	const context = toastContexts.at(-1);

	if (!context) {
		if (typeof window === "undefined") {
			return id;
		}

		pendingToasts = [...pendingToasts.filter((pendingToast) => pendingToast.id !== id), { ...toast, id }];

		return id;
	}

	return context.addToast({ ...toast, id });
}

export function registerToastContext(context: ToastContext): () => void {
	toastContexts.push(context);

	for (const toast of pendingToasts) {
		context.addToast(toast);
	}

	pendingToasts = [];

	return () => {
		const index = toastContexts.lastIndexOf(context);

		if (index !== -1) {
			toastContexts.splice(index, 1);
		}
	};
}

export function removeToast(id: ToastId): void {
	const pendingToastCount = pendingToasts.length;
	pendingToasts = pendingToasts.filter((toast) => toast.id !== id);
	if (pendingToasts.length !== pendingToastCount) {
		return;
	}

	for (const context of toastContexts) {
		context.removeToast(id);
	}
}
