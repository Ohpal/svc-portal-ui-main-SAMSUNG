import type { VTextField } from 'vuetify/components/VTextField';
import type { VAutocomplete }  from 'vuetify/components/VAutocomplete';
import type { VTextarea }  from 'vuetify/components/VTextarea';
export interface FormBoxType extends Array<Omit<VTextField, VAutocomplete, VTextarea, 'type', 'cols', 'title', 'id'> &
        {
        type: string;
        cols: string;
        title: string;
        id: string;
    }
>{}
