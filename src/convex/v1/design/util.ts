import { Infer } from 'convex/values';
import { Doc } from '../../_generated/dataModel';
import { vDesignLog } from './log/validator';
import { vUpdateDesign } from './validator';

function getDesignLog(previous: Doc<'designs'>, update: Infer<typeof vUpdateDesign>) {
	const previousLog: Infer<typeof vDesignLog> = {};
	const currentLog: Infer<typeof vDesignLog> = {};

	// Define the fields that should be logged (fields in vDesignLog)
	const loggableFields: Array<keyof Infer<typeof vDesignLog>> = [
		'name',
		'description',
		'spaceType',
		'inspirationImageUrl',
		'floorPlanFile',
		'productCategories',
		'productIds',
		'renderedImageUrl'
	];

	for (const key of loggableFields) {
		// Check if this field exists in the update
		if (key in update && update[key as keyof typeof update] !== undefined) {
			const updateValue = update[key as keyof typeof update];
			const previousValue = previous[key];

			// Check if the value has actually changed
			const hasChanged = JSON.stringify(updateValue) !== JSON.stringify(previousValue);

			if (hasChanged) {
				// @ts-expect-error - Dynamic assignment to typed object
				previousLog[key] = previousValue;
				// @ts-expect-error - Dynamic assignment to typed object
				currentLog[key] = updateValue;
			}
		}
	}

	return { previous: previousLog, current: currentLog };
}

const designUtil = {
	getDesignLog
};
export default designUtil;
