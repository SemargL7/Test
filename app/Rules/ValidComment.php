<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidComment implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
    }
    public function passes($attribute, $value)
    {
        $tagRegex = '/<[^>]+>/';
        $textWithoutTags = preg_replace($tagRegex, '', $value);

        $otherTagsRegex = '/<\s*(a|i|strong|code)\s*>/i';
        $allowedTags = ['i', 'a', 'strong', 'code'];
        $cleanedComment = preg_replace_callback($otherTagsRegex, function ($match) use ($allowedTags) {
            return in_array(strtolower($match[1]), $allowedTags) ? $match[0] : '';
        }, $textWithoutTags);

        return $cleanedComment === $textWithoutTags;
    }

    public function message()
    {
        return 'The comment contains disallowed HTML tags.';
    }
}
